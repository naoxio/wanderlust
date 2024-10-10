// geojson_handler.rs

use serde_json::Value;
use std::fs::File;
use std::io::Read;
use crate::models::{Country, Geometry, VisitStatus};
use dioxus_logger::tracing::{warn, info};

pub fn load_and_parse_geojson() -> Result<Vec<Country>, Box<dyn std::error::Error>> {
    let geojson = load_geojson()?;
    let countries = parse_geojson(&geojson);
    Ok(countries)
}

fn load_geojson() -> Result<Value, Box<dyn std::error::Error>> {
    let mut file = File::open("assets/countries.geojson")?;
    
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    
    let geojson: Value = serde_json::from_str(&contents)?;
    Ok(geojson)
}

pub fn parse_geojson(geojson: &Value) -> Vec<Country> {
    let empty_vec = Vec::new();
    let features = geojson["features"].as_array().unwrap_or(&empty_vec);

    features.iter().filter_map(|feature| {
        let properties = match feature["properties"].as_object() {
            Some(props) => props,
            None => {
                warn!("Feature without properties found");
                return None;
            }
        };

        let geometry = match feature["geometry"].as_object() {
            Some(geo) => geo,
            None => {
                warn!("Feature without geometry found");
                return None;
            }
        };

        // Log each property access
        let name = properties["name"].as_str().map(|s| s.to_string());
        let formal_name = properties["formal_en"].as_str().map(|s| s.to_string()).unwrap_or_default();
        let alpha2_code = properties["iso_a2"].as_str().map(|s| s.to_string());
        let alpha3_code = properties["iso_a3"].as_str().map(|s| s.to_string());
        let numeric_code = properties["iso_n3"].as_str().map(|s| s.to_string());
        let region = properties["region_un"].as_str().map(|s| s.to_string());
        let subregion = properties["subregion"].as_str().map(|s| s.to_string());
        let population = properties["pop_est"].as_i64();

        if name.is_none() || alpha2_code.is_none() || alpha3_code.is_none() || 
        numeric_code.is_none() || region.is_none() || subregion.is_none() || population.is_none() {
            return None;
        }
        let geometry = match geometry["type"].as_str() {
            Some("Polygon") => Geometry::Polygon {
                coordinates: parse_coordinates(geometry["coordinates"].as_array().unwrap_or(&empty_vec)),
            },
            Some("MultiPolygon") => Geometry::MultiPolygon {
                coordinates: geometry["coordinates"].as_array().unwrap_or(&empty_vec)
                    .iter()
                    .map(|poly| parse_coordinates(poly.as_array().unwrap_or(&empty_vec)))
                    .collect(),
            },
            _ => {
                warn!("Unsupported geometry type for country: {:?}", name);
                return None;
            }
        };

        Some(Country {
            name: name.unwrap(),
            formal_name,
            alpha2_code: alpha2_code.unwrap(),
            alpha3_code: alpha3_code.unwrap(),
            numeric_code: numeric_code.unwrap(),
            region: region.unwrap(),
            subregion: subregion.unwrap(),
            population: population.unwrap(),
            geometry,
            visit_status: VisitStatus::None,
        })
    }).collect()
}

fn parse_coordinates(coords: &[Value]) -> Vec<Vec<[f64; 2]>> {
    let empty_vec = Vec::new();
    coords.iter().map(|poly| {
        poly.as_array().unwrap_or(&empty_vec).iter().filter_map(|coord| {
            let coord = coord.as_array()?;
            Some([
                coord.get(0)?.as_f64()?,
                coord.get(1)?.as_f64()?,
            ])
        }).collect()
    }).collect()
}