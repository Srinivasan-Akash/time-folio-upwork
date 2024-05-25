const a = {
    "data": {
        "id": "1028457",
        "type": "subscription-invoices",
        "links": {
            "self": "https://api.lemonsqueezy.com/v1/subscription-invoices/1028457"
        },
        "attributes": {
            "tax": 0,
            "urls": {
                "invoice_url": "https://app.lemonsqueezy.com/my-orders/60bdccc3-f531-4bde-8ecc-23da8232c139/subscription-invoice/1028457?signature=fd4e112100fe621efc5eba6336dc354758baf70961d4d635997f67e7f245ee3a"
            },
            "total": 500,
            "status": "paid",
            "tax_usd": 0,
            "currency": "USD",
            "refunded": false,
            "store_id": 90700,
            "subtotal": 500,
            "test_mode": true,
            "total_usd": 500,
            "user_name": "S Akash",
            "card_brand": "visa",
            "created_at": "2024-05-25T07:16:56.000000Z",
            "updated_at": "2024-05-25T07:17:01.000000Z",
            "user_email": "prashanthiakash@gmail.com",
            "customer_id": 2922031,
            "refunded_at": null,
            "subtotal_usd": 500,
            "currency_rate": "1.00000000",
            "tax_formatted": "$0.00",
            "tax_inclusive": false,
            "billing_reason": "initial",
            "card_last_four": "4242",
            "discount_total": 0,
            "subscription_id": 390088,
            "total_formatted": "$5.00",
            "status_formatted": "Paid",
            "discount_total_usd": 0,
            "subtotal_formatted": "$5.00",
            "discount_total_formatted": "$0.00"
        },
        "relationships": {
            "store": {
                "links": {
                    "self": "https://api.lemonsqueezy.com/v1/subscription-invoices/1028457/relationships/store",
                    "related": "https://api.lemonsqueezy.com/v1/subscription-invoices/1028457/store"
                }
            },
            "customer": {
                "links": {
                    "self": "https://api.lemonsqueezy.com/v1/subscription-invoices/1028457/relationships/customer",
                    "related": "https://api.lemonsqueezy.com/v1/subscription-invoices/1028457/customer"
                }
            },
            "subscription": {
                "links": {
                    "self": "https://api.lemonsqueezy.com/v1/subscription-invoices/1028457/relationships/subscription",
                    "related": "https://api.lemonsqueezy.com/v1/subscription-invoices/1028457/subscription"
                }
            }
        }
    },
    "meta": {
        "test_mode": true,
        "event_name": "subscription_payment_success",
        "webhook_id": "3ab712d6-c258-42e4-9fa0-33a9119050da"
    }
}