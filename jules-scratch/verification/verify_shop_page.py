import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # 1. Login as Admin
    page.goto("http://127.0.0.1:8080/admin/login", timeout=60000)
    page.get_by_label("Email").fill("yahyahoussini366@gmail.com")
    page.get_by_label("Password").fill("ms3odaombark")
    page.get_by_role("button", name="Sign In").click()
    products_link = page.get_by_role("link", name="Products")
    expect(products_link).to_be_visible(timeout=15000)

    # 2. Add a new product
    products_link.click()
    page.get_by_role("button", name="Add Product").click()
    dialog = page.get_by_role("dialog")
    expect(dialog).to_be_visible()
    product_name = "Soap for Shop Page Test"
    dialog.get_by_label("Product Name").fill(product_name)
    dialog.get_by_label("Price (MAD)").fill("99")
    dialog.get_by_label("Description").fill("A special soap just for this test.")
    dialog.get_by_label("Tags").fill("test, e2e")

    # The "In Stock" checkbox defaults to true, so we don't need to interact with it.

    dialog.get_by_role("button", name="Add Product").click()
    expect(dialog).not_to_be_visible(timeout=10000)
    expect(page.get_by_role("row", name=re.compile(product_name, re.IGNORECASE))).to_be_visible()

    # 3. Sign Out
    page.get_by_role("button", name="Sign Out").click()
    expect(page).to_have_url(re.compile(r"/admin/login"), timeout=10000)

    # 4. Go to Shop page and verify
    page.goto("http://127.0.0.1:8080/shop", timeout=60000)
    expect(page.get_by_text(product_name)).to_be_visible(timeout=15000)

    # 5. Screenshot
    page.screenshot(path="jules-scratch/verification/shop_page_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
