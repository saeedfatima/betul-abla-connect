#!/usr/bin/env python3
"""
Simple test script to verify API endpoints
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_api_root():
    print("Testing API Root...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 50)

def test_register():
    print("Testing User Registration...")
    data = {
        "username": "testuser",
        "email": "test@example.com", 
        "password": "testpass123",
        "password_confirm": "testpass123",
        "full_name": "Test User",
        "role": "staff"
    }
    response = requests.post(f"{BASE_URL}/auth/register/", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 50)
    return response.json() if response.status_code == 201 else None

def test_login():
    print("Testing User Login...")
    data = {
        "username": "testuser",
        "password": "testpass123"
    }
    response = requests.post(f"{BASE_URL}/auth/login/", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 50)
    return response.json() if response.status_code == 200 else None

def test_protected_endpoint(token):
    print("Testing Protected Endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 50)

if __name__ == "__main__":
    print("=== API Testing Script ===")
    
    # Test API root
    test_api_root()
    
    # Test registration
    register_response = test_register()
    
    # Test login
    login_response = test_login()
    
    # Test protected endpoint if login successful
    if login_response and 'access' in login_response:
        test_protected_endpoint(login_response['access'])
    
    print("Testing complete!")