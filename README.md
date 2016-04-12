# SERP keyword statistics

Eat a list of keywords (and optionnaly a google domain extension, as sauce), and return an array of objets as follow :

```javascript
[
	{
		keyword: 'dandy',
		stat: '32 100 000',
		firstLink: 'https://fr.wikipedia.org/wiki/Dandy'
	},
	...
]
```

## Usage

```Javascript
const mod = require('./'),
    keywords = ['dandy', 'seo', 'dandy seo']

mod.keywordStats(keywords)
    .then(function (data) {
        console.log(data)
    })
```
