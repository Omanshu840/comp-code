import re
import json
from pathlib import Path

html = Path("page.html").read_text(
    encoding="utf-8",
    errors="ignore"
)

chunks = re.findall(
    r'self\.__next_f\.push\(\[1,"(.*?)"\]\)',
    html,
    re.DOTALL
)

payload = "".join(chunks)

start = payload.find('[{\\"category_id\\"')

if start == -1:
    raise Exception("Roadmap not found")

depth = 0
in_string = False
escape = False
end = None

for i in range(start, len(payload)):
    ch = payload[i]

    if escape:
        escape = False
        continue

    if ch == "\\":
        escape = True
        continue

    if ch == '"':
        in_string = not in_string
        continue

    if not in_string:
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1

            if depth == 0:
                end = i + 1
                break

raw = payload[start:end]

raw = raw.encode().decode("unicode_escape")

data = json.loads(raw)

Path("output").mkdir(exist_ok=True)

with open("output/roadmap.json", "w") as f:
    json.dump(data, f, indent=2)

problems = {}

for category in data:
    for sub in category["subcategories"]:
        for problem in sub["problems"]:
            problems[str(problem["problem_id"])] = problem

with open("output/problems.json", "w") as f:
    json.dump(problems, f, indent=2)

print("Categories:", len(data))
print("Problems:", len(problems))