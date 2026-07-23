import os
import re
import json
import uuid
import requests
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

# Initialize the Slack App with your Bot Token
app = App(token=os.environ.get("SLACK_BOT_TOKEN"))

# Define your internal n8n webhook URL

N8N_WEBHOOK_URL = "" # you will need to add your internal n8n webhook url here once you have created the workflow

ALL_CATEGORIES = [
    {"text": {"type": "plain_text", "text": "AI"}, "value": "ai"},
    {"text": {"type": "plain_text", "text": "Compliance"}, "value": "compliance"},
    {"text": {"type": "plain_text", "text": "Crisis Management"}, "value": "crisis_management"},
    {"text": {"type": "plain_text", "text": "Cryptocurrency"}, "value": "cryptocurrency"},
    {"text": {"type": "plain_text", "text": "Culture"}, "value": "culture"},
    {"text": {"type": "plain_text", "text": "Cybersecurity"}, "value": "cybersecurity"},
    {"text": {"type": "plain_text", "text": "Data Privacy"}, "value": "data_privacy"},
    {"text": {"type": "plain_text", "text": "Diversity, Equity, and Inclusion"}, "value": "dei"},
    {"text": {"type": "plain_text", "text": "Emerging Risks"}, "value": "emerging_risks"},
    {"text": {"type": "plain_text", "text": "Environmental, Social, and Governance"}, "value": "esg"},
    {"text": {"type": "plain_text", "text": "Fraud"}, "value": "fraud"},
    {"text": {"type": "plain_text", "text": "Geopolitical"}, "value": "geopolitical"},
    {"text": {"type": "plain_text", "text": "Healthcare"}, "value": "healthcare"},
    {"text": {"type": "plain_text", "text": "Mental Health"}, "value": "mental_health"},
    {"text": {"type": "plain_text", "text": "Internation"}, "value": "international"},
    {"text": {"type": "plain_text", "text": "Name Image and Likeness"}, "value": "nil"},
    {"text": {"type": "plain_text", "text": "Physical Security Threat"}, "value": "physical_security"},
    {"text": {"type": "plain_text", "text": "Policy"}, "value": "policy"},
    {"text": {"type": "plain_text", "text": "Post-Election"}, "value": "post-election"},
    {"text": {"type": "plain_text", "text": "Residential Life"}, "value": "residential_life"},
    {"text": {"type": "plain_text", "text": "Safety"}, "value": "safety"},
    {"text": {"type": "plain_text", "text": "Sexual Misconduct"}, "value": "sexual_misconduct"},
    {"text": {"type": "plain_text", "text": "Succession Planning"}, "value": "succession_planning"},
    {"text": {"type": "plain_text", "text": "Supply Chain"}, "value": "supply_chain"},
    {"text": {"type": "plain_text", "text": "Third Parties"}, "value": "third_parties"},
    {"text": {"type": "plain_text", "text": "Title IX"}, "value": "title_ix"},
    {"text": {"type": "plain_text", "text": "Weather"}, "value": "weather"},
    {"text": {"type": "plain_text", "text": "Workforce Management"}, "value": "workforce_management"}
]

def build_home_view(state):
    """Builds the view, utilizing dynamic block_ids to bust Slack's client cache."""

    # Generate a unique hash for dynamic block IDs to force UI updates
    ui_hash = uuid.uuid4().hex[:6]

    # Safely extract state variables
    selected_method = state.get("selected_method")
    selected_categories = state.get("categories", [])
    is_async = state.get("is_async", True)
    url_val = state.get("url_val")
    prompt_val = state.get("prompt_val")

    scrape_accessory = {
        "type": "static_select",
        "action_id": "select_scrape_method",
        "placeholder": {"type": "plain_text", "text": "Select an option..."},
        "options": [
            {"text": {"type": "plain_text", "text": "URL"}, "value": "url"},
            {"text": {"type": "plain_text", "text": "Custom Search"}, "value": "prompt"}
        ]
    }

    if selected_method == "url":
        scrape_accessory["initial_option"] = {"text": {"type": "plain_text", "text": "URL"}, "value": "url"}
    elif selected_method == "prompt":
        scrape_accessory["initial_option"] = {"text": {"type": "plain_text", "text": "Custom Search"}, "value": "prompt"}

    blocks = [
        {
            "type": "section",
            "text": {"type": "mrkdwn", "text": "Welcome! I am ARIA, your *Autonomus Risk Intelligence Advisor*! :tada: \nBelow you can ask me to: \n1. Preform a google search on a specific topic \n2. Ask me to assess a url of your choice \n3. Configure my information gathering process *(Starts every Sunday Afternoon)* \n\nFor more information, visit my *'about'* section\n\n\n"}
        },
        {"type": "header", "text": {"type": "plain_text", "text": "Risk Intelligence Scraper"}},
        {"type": "divider"},
        {"type": "section", "text": {"type": "mrkdwn", "text": "*Manual Scrape*"}},
        {
            "type": "section",
            "block_id": f"scrape_method_{ui_hash}", # Dynamic block ID
            "text": {"type": "mrkdwn", "text": "Choose your scrape method:"},
            "accessory": scrape_accessory
        }
    ]

    # Inject URL or Prompt block based on selection & preserve typed values
    if selected_method == "url":
        element = {"type": "url_text_input", "action_id": "url"}
        if url_val: element["initial_value"] = url_val
        blocks.append({
            "type": "input",
            "block_id": f"manual_url_{ui_hash}", # Dynamic block ID
            "label": {"type": "plain_text", "text": "URL"},
            "element": element
        })
    elif selected_method == "prompt":
        element = {"type": "plain_text_input", "multiline": True, "action_id": "prompt"}
        if prompt_val: element["initial_value"] = prompt_val
        blocks.append({
            "type": "input",
            "block_id": f"manual_prompt_{ui_hash}", # Dynamic block ID
            "label": {"type": "plain_text", "text": "Custom Search"},
            "element": element
        })

    # Async Checkbox setup
    async_option = {"text": {"type": "plain_text", "text": "Enable Asynchronous Search"}, "value": "enabled"}
    async_element = {
        "type": "checkboxes",
        "action_id": "enable_async",
        "options": [async_option]
    }

    if is_async:
        async_element["initial_options"] = [async_option]

    blocks.extend([
        {
            "type": "actions",
            "elements": [{"type": "button", "style": "primary", "text": {"type": "plain_text", "text": "Start Manual Scrape"}, "action_id": "manual_scrape"}]
        },
        {"type": "divider"},
        {"type": "section", "text": {"type": "mrkdwn", "text": "*Configure Asynchronous Search*\n\n\n"}},
        {
            "type": "input",
            "block_id": f"async_enabled_{ui_hash}", # Dynamic block ID
            "label": {"type": "plain_text", "text": "Asynchronous Search"},
            "element": async_element
        }
    ])

    # Dynamic Categories Element
    categories_element = {
        "type": "multi_static_select",
        "action_id": "categories",
        "placeholder": {"type": "plain_text", "text": "Select categories..."},
        "options": ALL_CATEGORIES
    }

    if selected_categories:
        initial_options = [opt for opt in ALL_CATEGORIES if opt["value"] in selected_categories]
        if initial_options:
            categories_element["initial_options"] = initial_options

    blocks.extend([
        {
            "type": "input",
            "block_id": f"topics_{ui_hash}", # Dynamic block ID forces cache clear!
            "label": {"type": "plain_text", "text": "Categories"},
            "element": categories_element
        },
        {
            "type": "actions",
            "elements": [
                {"type": "button", "text": {"type": "plain_text", "text": "Select All Categories"}, "action_id": "select_all_categories"},
                {"type": "button", "text": {"type": "plain_text", "text": "Clear Selection"}, "action_id": "clear_categories"}
            ]
        },
        {
            "type": "actions",
            "elements": [{"type": "button", "style": "primary", "text": {"type": "plain_text", "text": "Save Configuration"}, "action_id": "save_async"}]
        }
    ])

    return {
        "type": "home",
        "private_metadata": json.dumps(state), # Store Truth in hidden metadata!
        "blocks": blocks
    }


def extract_state(body):
    """
    Extracts true state by blending the hidden metadata state (baseline)
    with any fresh user interactions (state.values). Because block_ids are dynamic,
    we map state updates by their static `action_id`.
    """
    # 1. Load baseline state from private_metadata
    view = body.get("view", {})
    metadata_str = view.get("private_metadata", "{}")
    try:
        state = json.loads(metadata_str)
    except json.JSONDecodeError:
        state = {}

    # Defaults if missing
    state.setdefault("selected_method", None)
    state.setdefault("url_val", None)
    state.setdefault("prompt_val", None)
    state.setdefault("is_async", True)
    state.setdefault("categories", [])

    # 2. Overlay new un-saved user interactions
    state_values = view.get("state", {}).get("values", {})

    for block_id, actions in state_values.items():
        # Using action_id means we don't care about dynamic block_ids
        if "select_scrape_method" in actions:
            opt = actions["select_scrape_method"].get("selected_option")
            if opt: state["selected_method"] = opt["value"]

        if "url" in actions:
            state["url_val"] = actions["url"].get("value")

        if "prompt" in actions:
            state["prompt_val"] = actions["prompt"].get("value")

        if "enable_async" in actions:
            selected = actions["enable_async"].get("selected_options", [])
            state["is_async"] = len(selected) > 0

        if "categories" in actions:
            selected = actions["categories"].get("selected_options", [])
            state["categories"] = [opt["value"] for opt in selected]

    return state


##### APP TRIGGERS & HANDLERS #####

@app.event("app_home_opened")
def handle_app_home_opened(event, client):
    # Initialize brand new default state
    initial_state = {"is_async": True, "categories": []}
    client.views_publish(user_id=event["user"], view=build_home_view(initial_state))


@app.action("select_scrape_method")
def handle_scrape_method_selection(ack, body, client):
    ack()
    state = extract_state(body)
    client.views_publish(user_id=body["user"]["id"], view=build_home_view(state))


@app.action("select_all_categories")
def handle_select_all_categories(ack, body, client):
    ack()
    state = extract_state(body)
    # Inject all categories programmatically
    state["categories"] = [opt["value"] for opt in ALL_CATEGORIES]
    client.views_publish(user_id=body["user"]["id"], view=build_home_view(state))


@app.action("clear_categories")
def handle_clear_categories(ack, body, client):
    ack()
    state = extract_state(body)
    # Clear out categories programmatically
    state["categories"] = []
    client.views_publish(user_id=body["user"]["id"], view=build_home_view(state))


@app.action("manual_scrape")
def handle_manual_scrape(ack, body, logger, client):
    ack()
    state = extract_state(body)
    payload = None
    pattern = r"^(www\.)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(/.*)?$"


    if state["selected_method"] == "url" and state["url_val"]:
        if re.match(pattern, state["url_val"]):
            payload = {"job": "url","url": state["url_val"]}

    elif state["selected_method"] == "prompt" and state["prompt_val"]:
        payload = {"job": "prompt", "prompt": state["prompt_val"]}

    else:
        logger.error("No valid URL or Prompt input was found to scrape.")
        return

    try:
        response = requests.post(N8N_WEBHOOK_URL, json=payload, timeout=10)
        if response.status_code == 200:
            print("Processing your request...")
        else:
            print(f"n8n responded with status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to internal n8n: {e}")

    client.views_open(
        trigger_id=body["trigger_id"],
        view={
            "type": "modal",
            "title": {"type": "plain_text", "text": "Job in Process"},
            "blocks": [
                {"type": "section", "text": {"type": "mrkdwn", "text": "Your job is being processed. Go to this link to see your analysis.\n\nLink: https://riskintel.netlify.app/"}}
            ]
        }
    )

@app.action("save_async")
def handle_save_async(ack, body, client, logger):
    ack()
    state = extract_state(body)

    payload = {
        "job": "save_async",
        "categories": state["categories"],
        "async_enabled": state["is_async"]
    }

    try:
        response = requests.post(N8N_WEBHOOK_URL, json=payload, timeout=10)
        if response.status_code == 200:
            logger.info("Processing your request...")
        else:
            logger.error(f"n8n responded with status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Error connecting to internal n8n: {e}")

    display_text = ", ".join(state["categories"]) if state["categories"] else "None"
    async_status_text = "Enabled" if state["is_async"] else "Disabled"

    client.views_open(
        trigger_id=body["trigger_id"],
        view={
            "type": "modal",
            "title": {"type": "plain_text", "text": "Configuration Saved"},
            "blocks": [
                {"type": "section", "text": {"type": "mrkdwn", "text": f"*Async Mode:* {async_status_text}\n*Categories:* {display_text}"}}
            ]
        }
    )

# --- Silent Acknowledgment Handlers ---
@app.action("url")
def handle_url_input(ack): ack()

@app.action("prompt")
def handle_prompt_input(ack): ack()

@app.action("enable_async")
def handle_enable_async(ack): ack()

@app.action("categories")
def handle_categories_input(ack): ack()


if __name__ == "__main__":
    handler = SocketModeHandler(app, os.environ.get("SLACK_APP_TOKEN"))
    handler.start()