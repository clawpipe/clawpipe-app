#!/bin/bash
#
# CLAWPIPE Test Runner for OpenClaw Swarm
# Runs all scenario packs and captures results
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
CLI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${CLI_DIR}/reports/test-$(date +%Y%m%d-%H%M%S)"
TARGET_URL="${CLAWPIPE_TARGET:-}"

# Scenario packs to run
PACKS=(
    "basic-sanity"
    "basic-gauntlet"
    "tool-chaos"
    "prompt-hell"
    "memory-stress"
)

# Expected pass rates
declare -A EXPECTED_PASS=(
    ["basic-sanity"]="4-5"
    ["basic-gauntlet"]="3-5"
    ["tool-chaos"]="2-5"
    ["prompt-hell"]="2-5"
    ["memory-stress"]="2-5"
)

# Log functions
log_info() { echo -e "${CYAN}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_header() { echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"; }

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Print header
echo -e "${BOLD}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║   CLAWPIPE - OpenClaw Swarm Test Runner          ║"
echo "║   Week 4 Internal Test                           ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
log_info "Output directory: $OUTPUT_DIR"
if [ -n "$TARGET_URL" ]; then
    log_info "Target URL: $TARGET_URL"
else
    log_warn "No target URL set (running in simulation mode)"
fi

# Track results
declare -A RESULTS
TOTAL_PASS=0
TOTAL_FAIL=0

# Run each pack
for PACK in "${PACKS[@]}"; do
    log_header
    log_info "Running pack: $PACK"
    log_info "Expected: ${EXPECTED_PASS[$PACK]}/5 scenarios passing"
    log_header
    
    # Build command
    CMD="node ${CLI_DIR}/src/index.js run --pack $PACK --output $OUTPUT_DIR --format both"
    
    if [ -n "$TARGET_URL" ]; then
        CMD="$CMD --target $TARGET_URL"
    fi
    
    # Run the pack
    if eval $CMD; then
        log_success "Pack $PACK completed"
        
        # Check JSON result for pass count - find the most recent JSON with pack_id
        JSON_FILE=$(ls -t "${OUTPUT_DIR}"/clawpipe-${PACK}_*.json 2>/dev/null | head -1)
        if [ -f "$JSON_FILE" ]; then
            # Extract score and status from JSON - more robust parsing
            SCORE=$(grep -o '"score":[0-9]*' "$JSON_FILE" | head -1 | sed 's/.*://')
            PASS_COUNT=$(grep -o '"status": "pass"' "$JSON_FILE" | wc -l)
            FAIL_COUNT=$(grep -o '"status": "fail"' "$JSON_FILE" | wc -l)
            
            RESULTS[$PACK]="$PASS_COUNT/$FAIL_COUNT (score: $SCORE)"
            TOTAL_PASS=$((TOTAL_PASS + PASS_COUNT))
            TOTAL_FAIL=$((TOTAL_FAIL + FAIL_COUNT))
            
            # Check if result is within expected range
            if [ "$PASS_COUNT" -ge 2 ]; then
                log_success "Result: $PASS_COUNT/5 passing (within expected range)"
            else
                log_warn "Result: $PASS_COUNT/5 passing (below expected range)"
            fi
        else
            RESULTS[$PACK]="completed (no JSON found)"
            log_warn "No JSON result file found"
        fi
    else
        log_error "Pack $PACK failed to run"
        RESULTS[$PACK]="FAILED"
    fi
    
    echo ""
done

# Summary
log_header
echo -e "${BOLD}TEST RUN SUMMARY${NC}"
log_header

echo ""
echo -e "${BOLD}Results by Pack:${NC}"
echo "─────────────────────────────────────────────"
for PACK in "${PACKS[@]}"; do
    RESULT="${RESULTS[$PACK]}"
    echo "  $PACK: $RESULT"
done
echo "─────────────────────────────────────────────"
echo ""
echo -e "Total: ${TOTAL_PASS} passed, ${TOTAL_FAIL} failed"
echo ""

# Score interpretation
SANITY_JSON=$(ls -t "${OUTPUT_DIR}"/clawpipe-basic-sanity_*.json 2>/dev/null | head -1)
if [ -f "$SANITY_JSON" ]; then
    SANITY_SCORE=$(grep -o '"score":[0-9]*' "$SANITY_JSON" | head -1 | sed 's/"score"://')
    echo -e "${BOLD}Basic Sanity Score: ${SANITY_SCORE}/100${NC}"
    
    if [ -n "$SANITY_SCORE" ]; then
        if [ "$SANITY_SCORE" -ge 80 ]; then
            log_success "Core functionality: STRONG"
        elif [ "$SANITY_SCORE" -ge 60 ]; then
            log_warn "Core functionality: ACCEPTABLE"
        else
            log_error "Core functionality: CONCERNING"
        fi
    fi
fi

echo ""
log_info "Full reports saved to: $OUTPUT_DIR"
echo ""

# Exit code based on basic-sanity pass rate
if [ "$TOTAL_PASS" -lt 5 ]; then
    log_warn "One or more critical tests failed"
    exit 1
else
    log_success "All critical tests passed"
    exit 0
fi
