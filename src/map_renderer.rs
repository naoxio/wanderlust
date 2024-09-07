use crate::models::{Country, Geometry, SelectedCountry};
use dioxus::prelude::*;
use std::collections::HashMap;

pub fn render_map(countries: Signal<Vec<Country>>) -> Element {
    let path_cache = use_memo(move || {
        let mut cache = HashMap::new();
        for country in countries.read().iter() {
            let path = match &country.geometry {
                Geometry::Polygon { coordinates } => coordinates_to_path(coordinates),
                Geometry::MultiPolygon { coordinates } => coordinates.iter()
                    .map(|poly| coordinates_to_path(poly))
                    .collect::<Vec<String>>()
                    .join(" ")
            };
            cache.insert(country.name.clone(), path);
        }
        cache
    });

    rsx! {
        svg {
            width: "100%",
            height: "100%",
            view_box: "-180 -90 360 180",
            {countries.read().iter().map(|country| {
                render_country(country, path_cache())
            })}
        }
    }
}

fn render_country(country: &Country, path_cache: HashMap<String, String>) -> Element {
    let mut selected_country = use_context::<Signal<SelectedCountry>>();

    let path = path_cache.get(&country.name).cloned().unwrap_or_default();

    let is_selected = selected_country.read().0.as_ref().map(|c| c.name == country.name).unwrap_or(false);

    let country_name = country.name.clone();
    let country_clone = country.clone();

    rsx! {
        path {
            class: if is_selected { "selected" } else { "" },
            d: "{path}",
            onclick: move |_| {
                selected_country.set(SelectedCountry(Some(country_clone.clone())));
            },
            title {
                "{country_name}"
            }
        }
    }
}
fn coordinates_to_path(coordinates: &[Vec<[f64; 2]>]) -> String {
    coordinates.iter().enumerate().map(|(i, poly)| {
        let mut path = String::new();
        for (j, [x, y]) in poly.iter().enumerate() {
            if j == 0 {
                path.push_str(&format!("M {} {} ", x, -y));
            } else {
                path.push_str(&format!("L {} {} ", x, -y));
            }
        }
        path.push('Z');
        path
    }).collect::<Vec<String>>()
    .join(" ")
}