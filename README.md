# Kerala place name analysis

More details in Mastodon/Twitter
* https://aana.site/@subins2000/113293709571986700
* https://x.com/SubinSiby/status/1844991107567939650

## Dataset

* Get list of places
  * Places in Kerala: https://overpass-api.de/api/interpreter?data=[out:json];area[name=%22Kerala%22];node(area)[place];out;
  * Bus stops in Kerala: https://overpass-api.de/api/interpreter?data=[out:json];area[name=%22Kerala%22]-%3E.searchArea;node[%22highway%22=%22bus_stop%22](area.searchArea);out;
* Get list of places from Wikidata (list of human settlements (places) in Kerala)

```sql
SELECT DISTINCT ?item ?len ?lml ?coord
WHERE
{
  ?item wdt:P31 wd:Q486972 .
  ?item wdt:P131/wdt:P131* wd:Q1186.
  ?item wdt:P625 ?coord.
  OPTIONAL { ?item rdfs:label ?len. FILTER(LANG(?len)="en") }
  OPTIONAL { ?item rdfs:label ?lml. FILTER(LANG(?lml)="ml") }
}
LIMIT 100
```
* Get list of wards that has a coordinate from Wikidata

```sql
SELECT DISTINCT ?item ?len ?lml ?coord
WHERE
{
  ?item wdt:P31 wd:Q1195098 .
  ?item wdt:P131* wd:Q1186.
  ?item wdt:P625 ?coord.
  OPTIONAL { ?item rdfs:label ?len. FILTER(LANG(?len)="en") }
  OPTIONAL { ?item rdfs:label ?lml. FILTER(LANG(?lml)="ml") }
}
```

## Map

Get boundary of Kerala districts. Go to https://overpass-turbo.eu/ and run this query:

```ruby
[out:xml][timeout:500];
{{geocodeArea:Kerala}}->.searchArea;
(
  nwr["boundary"="administrative"]["admin_level"="5"](area.searchArea);
);
// print results
out meta;
>;
out meta qt;
```

Download file as geojson and load it in leaflet.
