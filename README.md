# XMJS
## What's XMJS?

XMJS is an XML parsing library for JavaScript. It has a `parse` and a `stringify` method, similar to the built-in `JSON` library and a ton of more features!

## Usage / Documentation
### Importing
To use this library, you have to first import it by doing the following:
```js
const XML = require("xmjs");
```
### Parsing
For parsing XML, you can run the following:
```js
XML.parse("<ExampleXML>hello world</ExampleXML>");
/*
{
    ExampleXML: {
        value: 'hello world',
        attributes: {}
    }
}
*/
```
This is how XMJS parses nested tags:
```js
XML.parse("<SupportsNesting><NestedTag>I am a nested tag!</NestedTag></SupportsNesting>");
/*
{
    SupportsNesting: {
        NestedTag: {
            value: 'I am a nested tag!',
            attributes: {}
        }
    }
}
*/
```
XMJS also supports parsing attributes of tags:
```js
XML.parse("<SomeTag hello=\"world\"></SomeTag>");
/*
{
    SomeTag: {
        value: '',
        attributes: {
            hello: 'world'
        }
    }
}
*/

XML.parse("<Person name=\"Jonathan\" surname=\"Doe\"><Job income=\"500$\"></Job></Person>");
/*
{
    Person: {
        Job: {
            value:'',
            attributes: {
                income: '500$'
            }
        },
        attributes: {}
    }
}
*/
```
### Stringifying
XMJS can stringify JavaScript objects, just like how the `JSON.stringify` method does it
```js
XML.stringify({
    Person: {
        Name: "Jonathan",
        Surname: "Doe",
        EMail: "john@doe.com",
        Job: {
            Income: "500$"
        }
    }
});
/*
<Person>
    <Name>Jonathan</Name>
    <Surname>Doe</Surname>
    <EMail>john@doe.com</EMail>
    <Job>
        <Income>500$</Income>
    </Job>
</Person>
*/
```
### Validating
XMJS can validate XML through `XML.validate`:
```js
XML.validate("<Tag>hello world</Tag>"); // Parses and returns { Tag: { value: 'hello world', attributes: {} } }

XML.validate("i am not valid XML"); // Returns false
```

### XML To JSON
XMJS can convert XML data to JSON:
```js
XML.xmlToJson("<Person name=\"Jonathan\" surname=\"Doe\"><Job income=\"500$\">Engineer</Job></Person>");
/*
{
    "Person": {
        "Job": {
            "value": "Engineer",
            "attributes": {
                "income": "500$"
            }
        },
        "attributes": {
            "name": "Jonathan",
            "surname":"Doe"
        }
    }
}
*/
```

### JSON to XML
XMJS can also convert JSON data to XML:
```js
XML.jsonToXml("{ \"Hello\": \"World\" }");
/*
<Hello>World</Hello>
*/
```