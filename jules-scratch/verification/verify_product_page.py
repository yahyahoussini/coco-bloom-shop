import re
from playwright.sync_api import Page, expect

def test_product_page_and_cod_modal(page: Page):
    """
    This test verifies that the product page renders correctly and that
    the 'Buy Now' button opens the COD modal.
    """
    # 1. Arrange: Go to the product page.
    page.goto("http://localhost:5173/product/hydrating-body-wash")

    # 2. Assert: Check if the main heading is visible.
    heading = page.get_by_role("heading", name="Hydrating Body Wash")
    expect(heading).to_be_visible()

    # 3. Screenshot: Capture the initial page view.
    page.screenshot(path="jules-scratch/verification/product_page.png")

    # 4. Act: Click the "Buy Now" button.
    buy_now_button = page.get_by_role("button", name="Buy Now")
    buy_now_button.click()

    # 5. Assert: Check if the modal title is visible.
    modal_title = page.get_by_role("heading", name="Confirm Your Order")
    expect(modal_title).to_be_visible()

    # 6. Screenshot: Capture the page with the modal open.
    page.screenshot(path="jules-scratch/verification/cod_modal.png")
