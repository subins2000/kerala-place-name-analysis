#

* Get list of places
  * Places in Kerala: https://overpass-api.de/api/interpreter?data=[out:json];area[name=%22Kerala%22];node(area)[place];out;
  * Bus stops in Kerala: https://overpass-api.de/api/interpreter?data=[out:json];area[name=%22Kerala%22]-%3E.searchArea;node[%22highway%22=%22bus_stop%22](area.searchArea);out;
* Get list of places from Wikidata (list of human settlements (places) in Kerala)

```
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