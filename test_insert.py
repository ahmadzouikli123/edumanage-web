# -*- coding: utf-8 -*-
import urllib.request, json

url = "https://mhrtzppoiinpnbnximuf.supabase.co/rest/v1/students"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ"

data = json.dumps({"name":"Test Student","sid":"S999","class_id":1,"gender":"Male","phone":"555-9999","status":"Active"}).encode()
req = urllib.request.Request(url, data=data, headers={
    "apikey": key,
    "Authorization": "Bearer " + key,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}, method="POST")
try:
    res = urllib.request.urlopen(req)
    print("Insert OK:", json.loads(res.read()))
except urllib.error.HTTPError as e:
    print("Error:", e.code, e.read().decode())
