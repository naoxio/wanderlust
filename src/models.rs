// models.rs

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Country {
    pub name: String,
    pub formal_name: String,
    pub alpha2_code: String,
    pub alpha3_code: String,
    pub numeric_code: String,
    pub region: String,
    pub subregion: String,
    pub population: i64,
    pub geometry: Geometry,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub enum Geometry {
    Polygon { coordinates: Vec<Vec<[f64; 2]>> },
    MultiPolygon { coordinates: Vec<Vec<Vec<[f64; 2]>>> },
}

#[derive(Clone, PartialEq)]
pub struct SelectedCountry(pub Option<Country>);
