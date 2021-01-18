# Products-API
A comprehensive SQL query API with limiting, pagination, filtering, and sorting.

QUERIES:

1. Each query MUST have an equal sign, followed by the urlencoded operator (<,=,>,etc).
For example: price=%3D5 (or 'price' + '=' + '%3D' + '5') translates to price:=5 in the query.

    A urlencoded reference can be found here: https://www.w3schools.com/tags/ref_urlencode.ASP

2. For sorting, use the 'sortBy', + '=' followed by property + '%20'(space) + 'ASC'|'DESC' + '%2C' (comma). Translates to sortBy:"price ASC,productName DESC".
For example: sortBy=price%20ASC%2CproductName%20DESC 

    Note that sortBy must come first.

3. If more than one query, use '&' to separate them. Again, sortBy must come first.

4. If you want to limit results, do limit=20 or something like that. Simple.

5. If you want pagination (page 2, etc.) you must first have a limit with the number of results, followed by the page number (with each page containing n results) with a minimum of page 1.

    Example: limit=5&page=2

6. A big query could look like: /?price=%3C100&sortBy=price%20ASC%2CproductName%20DESC&limit=5&page=2

This API could also be used to generate more data in your database. Just uncomment the faker code and run it once!
