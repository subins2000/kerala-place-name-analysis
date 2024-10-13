require 'active_record'
require 'json'
require 'pry'
require 'sqlite3'

# 1. Establish a connection to SQLite
ActiveRecord::Base.establish_connection(
  adapter: 'sqlite3',
  database: 'db.sqlite3'
)

# 2. Define a model class (corresponding to a table)
class Place < ActiveRecord::Base
end

@first_run = !Place.table_exists?

# 3. Create the table (migration-like setup)
if @first_run
  ActiveRecord::Schema.define do
    create_table :places do |t|
      t.string :name
      t.string :lat
      t.string :lon
      t.timestamps
    end
    add_index :places, :name, unique: true
  end
end

@records = []

def osm_bus_stops
  data = JSON.parse(File.read("raw/osm-kerala-bus-stop-nodes.json"))
  data["elements"].each do |elem|
    @records << {name: elem["tags"]["name"], lat: elem["lat"], lon: elem["lon"]}
  end
end

def osm_place_nodes
  data = JSON.parse(File.read("raw/osm-kerala-place-nodes.json"))
  data["elements"].each do |elem|
    @records << {name: elem["tags"]["name"], lat: elem["lat"], lon: elem["lon"]}
    @records << {name: elem["tags"]["name:ml"], lat: elem["lat"], lon: elem["lon"]} if elem["tags"]["name:ml"].present?
  end
end

def wikidata_places
  data = JSON.parse(File.read("raw/wikidata-kerala-places-with-coords.json"))
  data.each do |elem|
    coords = elem["coord"].match(/Point\(([-\d.]+) ([-\d.]+)\)/)

    next unless coords

    lon = coords[1].to_f
    lat = coords[2].to_f

    @records << {name: elem["len"], lat:, lon:}
    @records << {name: elem["lml"], lat:, lon:} if elem["lml"].present?
  end
end

def wikidata_wards
  data = JSON.parse(File.read("raw/wikidata-wards-with-coords.json"))
  data.each do |elem|
    coords = elem["coord"].match(/Point\(([-\d.]+) ([-\d.]+)\)/)

    next unless coords

    lon = coords[1].to_f
    lat = coords[2].to_f

    @records << {name: elem["len"], lat:, lon:}
    @records << {name: elem["lml"], lat:, lon:} if elem["lml"].present?
  end
end

if @first_run
  osm_bus_stops
  osm_place_nodes
  wikidata_places
  wikidata_wards

  Place.insert_all(@records)
end

data = Place.where("name LIKE '%mugal%' OR name LIKE '%mukal%' OR name LIKE '%മുഗൾ%'").pluck(:name, :lat, :lon).to_json
File.write("data.json", data)

binding.pry
