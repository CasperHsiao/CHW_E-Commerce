# *CSR E-Commerce Store* API Documentation
Provides data about each sneaker in the store, including names, price, sizes, and description. Each
endpoint returns data in either plain text or JSON object. If your submit an invalid query, an http
error code of 400 with an error message.

## Get all sneakers names
**Request Format:** /csr/sneaker/all

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** This endpoint takes a query parameter all and returns a plain text response of all
                 the sneaker names in store, each sneaker name per line. Starting with the sneaker
                 id follower by the sneaker name and the edition name separated by "-".

**Example Request:** /csr/sneaker/all

**Example Response:** (abbreviated)

```json
[
  {"name":"Nike_Air_Max_97_QS","price":180},
  {"name":"Nike_Air_Max_97_Ultra_'17","price":160},
  {"name":"Nike_Air_Vapormax_Flyknit_3","price":190},
  {"name":"Nike_Hyperdunk_2015","price":140},
  {"name":"Nike_Kobe_A.D.","price":140},
  {"name":"Nike_Kobe_IV_Protro-Draft_Day","price":175},
  .....
  {"name":"Nike_Zoom_KD12-Warriors_Home","price":150}
]
```

**Error Handling:**
Responds with a 500 status plain text message if the server is broken.

## Get sneaker data
**Request Format:** /csr/sneaker/:name

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This endpoint takes a query parameter of any sneaker name and returns a JSON
                 object response of the sneaker detailed data.

**Example Request:** /csr/sneaker/Nike_PG_3-BHM

**Example Response:**

```json
{
  "id":8,
  "name":"Nike_PG_3-BHM",
  "price":110,
  "sizes":"8-8.5-9-9.5-10-10.5-11-11.5-12-12.5-13-14",
  "category":"-men-featured",
  "description":"Paul George's latest lightweight signature model, the Nike PG3 is built to excel
  on the hardwood. Featuring a mesh upper with synthetic overlays, they also have an integrated
  tongue design, Zoom Air cushioning, and multi-directional traction on the outsole. This \"Black
  History Month\" edition features a design inspired by the culture of the Congo, including
  colorful woven pattern, and metallic gold accents."
}
```

**Error Handling:**
Responds with a 400 status code and a plain text message if the query is invalid. Responds with a
500 status plain text message if the server is broken.

## Get category
**Request Format:** /csr/category/:category

**Request Type:** GET

**Returned Data Format**: plain text

**Description:** This endpoint takes a query parameter of any category and returns a plain text
                 response of all the sneaker names in that category, each sneaker name per line.
                 Starting with the sneaker id follower by the sneaker name and the edition name
                 separated by "-".

**Example Request:** /csr/category/women

**Example Response:**

```json
[
  {"name":"Nike_Women's_Air_Max_95","price":160},
  {"name":"Nike_Women's_Air_Max_97_Ultra_'17","price":160},
  {"name":"Nike_Women's_Air_Max_97","price":160},
  {"name":"Nike_Women's_Air_Max_270_React-Bauhaus","price":150},
  {"name":"Nike_Women's_Huarache_City_Low","price":120},
  {"name":"Nike_Women's_Roshe_One","price":75},
  {"name":"Nike_Women's_Air_Max_1_Premium","price":120}
]
```

**Error Handling:**
Responds with a 400 status code and a plain text message if the query invalid. Responds with a
500 status plain text message if the server is broken.

## Get FAQ
**Request Format:** /csr/faq

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns a JSON response of all the FAQ in an array.

**Example Request:** /csr/faq

**Example Response:**

```json
[
  {"question":"What is CSR?","answer":"CSR is a sneaker retail corporation founded in 2019,
    based in Seattle, Washington."},
  {"question":"What does CSR stand for?","answer":"CSR stands for Chum's Sneaker Retail. "},
  {"question":"How are the sneaker prices determined?","answer":"The sneaker prices are set by
    the individual sellers and CSR. The sneaker price display includes the cost of the sneaker,
    service fee, and shipment fee."},
  {"question":"What are the sneaker brands on CSR?","answer":"CSR currently sells Nike brand
    sneakers only. More sneaker brands will be included in the future."},
  {"question":"How do I know if the sneakers on CSR are not 'fake'?","answer":"All sneakers on CSR
    are verified by CSR sneaker professionals. We ensure that all sneakers are as real as our
    brand is."}
]
```

**Error Handling:**
Responds with a 500 status plain text message if the server is broken.

## Get feedback
**Request Format:** /csr/feedback
                    { method : "POST", body : {feedback : [text]} }

**Request Type:** POST
                  Requires a feedback parameter.

**Returned Data Format**: plain text

**Description:** Stores all the feedbacks received from the contact us form. Adds the feedback to
                the feedback table of CSR database. Returns a plain text success message when the
                feedback is successfully received.

**Example Request:** /csr/feedback
                    {
                      body : {
                        feedback : "This is a great website for sneaker second hand retail!"
                      }
                    }

**Example Response:**

```
Your feedback has been received. Thank You!
```

**Error Handling:**
Responds with a 400 status code and a plain text message if the query invalid. Responds with a
500 status plain text message if the server is broken.