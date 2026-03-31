# -*- coding: utf-8 -*-
import urllib.request, json

url = "https://mhrtzppoiinpnbnximuf.supabase.co/rest/v1/teachers?select=*"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ"

req = urllib.request.Request(url, headers={"apikey": key, "Authorization": "Bearer " + key})
try:
    res = urllib.request.urlopen(req)
    data = json.loads(res.read())
    print(f"Teachers table OK! Found {len(data)} teachers")
except urllib.error.HTTPError as e:
    print(f"Error {e.code}:", e.read().decode())
