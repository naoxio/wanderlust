// main.rs

use dioxus::prelude::*;
use crate::geojson_handler::load_and_parse_geojson;
use crate::map_renderer::render_map;
use crate::models::{Country, SelectedCountry};
use dioxus_logger::tracing::{info};


#[derive(Clone, Routable, Debug, PartialEq)]
enum Route {
    #[route("/")]
    Map {},
}

#[component]
pub fn App() -> Element {

    let selected_country = use_signal(|| SelectedCountry(None));
    use_context_provider(|| selected_country);
    
    rsx! {
        style { {include_str!("../assets/styles.css")} }

        Router::<Route> {}
    }
}
#[component]
fn Map() -> Element {
    let mut selected_country = use_context::<Signal<SelectedCountry>>();


    let countries = use_signal(|| {
        match load_and_parse_geojson() {
            Ok(countries) => {
                countries
            },
            Err(e) => {
                info!("Error loading and parsing GeoJSON: {}", e);
                vec![]
            }
        }
    });


    rsx! {
        div {
            class: "floating-element",
            h1 { "Magical World Explorer" }
        }
        div {
            class: "map-container",
            { render_map(countries) }
        }
        div {
            class: "country-info",
            {
                selected_country.read().0.as_ref().map(|country| rsx! {
                    h2 { "{country.name}" }
                    p { "Region: {country.region}" }
                    p { "Subregion: {country.subregion}" }
                })
            }
        }
        button {
            class: "magical-button",
            onclick: move |_| {
                selected_country.set(SelectedCountry(None));
            },
            "Explore Another Country"
        }
    }
}