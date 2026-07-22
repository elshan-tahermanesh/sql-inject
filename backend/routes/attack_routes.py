import os
import sys
from flask import Blueprint, request, jsonify

# Ensure backend root is in sys.path to resolve attacks folder correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from attacks.classic_injector import run_attack as run_classic
from attacks.login_bypass_injector import run_attack as run_login_bypass
from attacks.union_injector import run_attack as run_union
from attacks.blind_injector import run_attack as run_blind
from attacks.comment_injector import run_attack as run_comment
from attacks.droptable import run_attack as run_droptable
from attacks.table_enumeration_injector import run_attack as run_table_enumeration

attack_bp = Blueprint('attack_bp', __name__)

def get_params():
    data = request.get_json(silent=True) or {}
    target_url = data.get('target_url', '')
    payload = data.get('payload', '')
    return target_url, payload

@attack_bp.route('/classic', methods=['POST'])
def classic_attack():
    target_url, payload = get_params()
    if not target_url or not payload:
        return jsonify({"success": False, "error": "Missing target_url or payload"}), 400
    try:
        output = run_classic(target_url, payload)
        return jsonify({"success": True, "output": output})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@attack_bp.route('/login-bypass', methods=['POST'])
def login_bypass_attack():
    target_url, payload = get_params()
    if not target_url or not payload:
        return jsonify({"success": False, "error": "Missing target_url or payload"}), 400
    try:
        res = run_login_bypass(target_url, payload)
        if isinstance(res, dict):
            return jsonify({
                "success": True,
                "output": res["output"],
                "target_reachable": res["target_reachable"],
                "http_request_completed": res["http_request_completed"],
                "authentication_bypassed": res["authentication_bypassed"],
                "final_url": res["final_url"]
            })
        return jsonify({"success": True, "output": res})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@attack_bp.route('/union', methods=['POST'])
def union_attack():
    target_url, payload = get_params()
    if not target_url or not payload:
        return jsonify({"success": False, "error": "Missing target_url or payload"}), 400
    try:
        res = run_union(target_url, payload)
        if isinstance(res, dict):
            return jsonify({
                "success": res["success"],
                "output": res["output"],
                "target_reachable": res["target_reachable"],
                "http_request_completed": res["http_request_completed"],
                "union_leak_detected": res["union_leak_detected"],
                "status_code": res["status_code"],
                "elapsed_ms": res["elapsed_ms"],
                "response_length": res["response_length"],
                "final_url": res["final_url"],
                "total_rows": res["total_rows"],
                "leaked_rows_count": res["leaked_rows_count"],
                "executed_query": res["executed_query"],
                "leaked_rows": res["leaked_rows"],
                "reason": res["reason"]
            })
        return jsonify({"success": True, "output": res})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@attack_bp.route('/blind', methods=['POST'])
def blind_attack():
    target_url, payload = get_params()
    if not target_url or not payload:
        return jsonify({"success": False, "error": "Missing target_url or payload"}), 400
    try:
        res = run_blind(target_url, payload)
        if isinstance(res, dict):
            return jsonify({
                "success": res["success"],
                "output": res["output"],
                "target_reachable": res["target_reachable"],
                "blind_condition": res["blind_condition"],
                "status_code": res["status_code"],
                "elapsed_ms": res["elapsed_ms"],
                "response_length": res["response_length"],
                "final_url": res["final_url"],
                "reason": res["reason"]
            })
        return jsonify({"success": True, "output": res})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@attack_bp.route('/comment', methods=['POST'])
def comment_attack():
    target_url, payload = get_params()
    if not target_url or not payload:
        return jsonify({"success": False, "error": "Missing target_url or payload"}), 400
    data = request.get_json(silent=True) or {}
    password = data.get('password', 'test')
    try:
        res = run_comment(target_url, payload, password)
        if isinstance(res, dict):
            return jsonify({
                "success": res["success"],
                "output": res["output"],
                "target_reachable": res["target_reachable"],
                "comment_injection": res["comment_injection"],
                "status_code": res["status_code"],
                "elapsed_ms": res["elapsed_ms"],
                "response_length": res["response_length"],
                "redirected": res["redirected"],
                "cookies_received": res["cookies_received"],
                "final_url": res["final_url"],
                "reason": res["reason"]
            })
        return jsonify({"success": True, "output": res})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@attack_bp.route('/drop-table', methods=['POST'])
def drop_table_attack():
    target_url, payload = get_params()
    if not target_url or not payload:
        return jsonify({"success": False, "error": "Missing target_url or payload"}), 400
    try:
        res = run_droptable(target_url, payload)
        if isinstance(res, dict):
            return jsonify({
                "success": res["success"],
                "output": res["output"],
                "target_reachable": res["target_reachable"],
                "table_dropped": res.get("table_dropped", False),
                "table_name": res.get("table_name", "products"),
                "status_code": res["status_code"],
                "elapsed_ms": res["elapsed_ms"],
                "response_length": res["response_length"],
                "reason": res["reason"],
                "vulnerability_detected": res.get("vulnerability_detected", False),
                "stacked_queries_possible": res.get("stacked_queries_possible", False),
                "destructive_statement_executed": res.get("destructive_statement_executed", False),
                "table_exists_before": res.get("table_exists_before", True),
                "table_exists_after": res.get("table_exists_after", True)
            })
        return jsonify({"success": True, "output": res})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@attack_bp.route('/table-enumeration', methods=['POST'])
def table_enumeration_attack():
    target_url, payload = get_params()
    if not target_url or not payload:
        return jsonify({"success": False, "error": "Missing target_url or payload"}), 400
    try:
        res = run_table_enumeration(target_url, payload)
        if isinstance(res, dict):
            return jsonify({
                "success": res["success"],
                "output": res["output"],
                "target_reachable": res["target_reachable"],
                "http_request_completed": res["http_request_completed"],
                "table_enumeration_detected": res["table_enumeration_detected"],
                "status_code": res["status_code"],
                "elapsed_ms": res["elapsed_ms"],
                "response_length": res["response_length"],
                "final_url": res["final_url"],
                "executed_query": res["executed_query"],
                "tables_count": res["tables_count"],
                "tables": res["tables"],
                "reason": res["reason"]
            })
        return jsonify({"success": True, "output": res})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
