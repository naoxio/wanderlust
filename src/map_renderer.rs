use crate::models::{Country, Geometry, SelectedCountry};
use dioxus::prelude::*;

pub fn render_map(countries: Signal<Vec<Country>>) -> Element {

    rsx! {
        svg {
            width: "100%",
            height: "100%",
            view_box: "-180 -90 360 180",
            {countries.read().iter().map(|country| {
                render_country(country)
            })}
        }
    }
}

fn render_country(country: &Country) -> Element {
    let mut selected_country = use_context::<Signal<SelectedCountry>>();

    let path = match &country.geometry {
        Geometry::Polygon { coordinates } => coordinates_to_path(coordinates),
        Geometry::MultiPolygon { coordinates } => coordinates.iter()
            .map(|poly| coordinates_to_path(poly))
            .collect::<Vec<String>>()
            .join(" ")
    };

    let is_selected = selected_country.read().0.as_ref().map(|c| c.name == country.name).unwrap_or(false);

    let country_name = country.name.clone();
    let country_clone = country.clone();

    rsx! {
        path {
            d: "{path}",
            fill: if is_selected { "var(--color-primary)" } else { "var(--color-secondary)" },
            stroke: "var(--bg-primary)",
            "stroke-width": "0.5",
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