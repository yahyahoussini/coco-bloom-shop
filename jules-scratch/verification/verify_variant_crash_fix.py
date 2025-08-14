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

    # 2. Add a new product without variants
    products_link.click()
    page.get_by_role("button", name="Add Product").click()
    dialog = page.get_by_role("dialog")
    expect(dialog).to_be_visible()
    product_name = "No Variant Crash Test Soap"
    dialog.get_by_label("Product Name").fill(product_name)
    dialog.get_by_label("Price (MAD)").fill("88")
    dialog.get_by_label("Description").fill("A special soap to test the variant crash fix.")
    dialog.get_by_label("Tags").fill("test, crash-fix")
    dialog.get_by_role("button", name="Add Product").click()
    expect(dialog).not_to_be_visible(timeout=10000)

    # 3. Get the slug from the newly created product row
    new_product_row = page.get_by_role("row", name=re.compile(product_name, re.IGNORECASE))
    expect(new_product_row).to_be_visible(timeout=10000)

    # The product name is in a link inside the row. Find that link to get the href.
    product_link = new_product_row.get_by_role("link", name=product_name)
    href = product_link.get_attribute("href")
    slug = href.split('/')[-1]

    # 4. Navigate to the product detail page
    page.goto(f"http://127.0.0.1:8080/product/{slug}", timeout=60000)

    # 5. Verify the page loaded and did not crash
    # We check for the product title on the detail page.
    product_title_heading = page.get_by_role("heading", name=re.compile(product_name, re.IGNORECASE))
    expect(product_title_heading).to_be_visible(timeout=15000)

    # 6. Screenshot
    page.screenshot(path="jules-scratch/verification/variant_crash_fix_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
