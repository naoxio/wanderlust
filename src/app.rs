use dioxus::prelude::*;
use crate::geojson_handler::load_and_parse_geojson;
use crate::map_renderer::render_map;
use crate::models::{Country, SelectedCountry, VisitStatus};

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
    let selected_country = use_context::<Signal<SelectedCountry>>();
    let mut countries = use_signal(|| {
        match load_and_parse_geojson() {
            Ok(countries) => countries,
            Err(e) => {
                // Log the error or handle it appropriately
                eprintln!("Error loading countries: {:?}", e);
                vec![]
            }
        }
    });
    
    let mut update_visit_status = move |country_name: String, new_status: VisitStatus| {
        countries.with_mut(|countries| {
            if let Some(country) = countries.iter_mut().find(|c| c.name == country_name) {
                country.visit_status = new_status;
            }
        });
    };
    let selected = selected_country.clone();
    rsx! {
        div { class: "country-info",
            {selected.as_ref().map(|country| {
                rsx! {
                    h2 { "{country.name}" }
                    p { "Region: {country.region}" }
                    p { "Subregion: {country.subregion}" }
                    div { class: "visit-status-toggle",
                        button {
                            class: if country.visit_status == VisitStatus::Been { "active" } else { "" },
                            onclick: move |_| update_visit_status(country.name.clone(), VisitStatus::Been),
                            "Been"
                        }
                        button {
                            class: if country.visit_status == VisitStatus::Want { "active" } else { "" },
                            onclick: move |_| update_visit_status(country.name.clone(), VisitStatus::Want),
                            "Want"
                        }
                        button {
                            class: if country.visit_status == VisitStatus::Lived { "active" } else { "" },
                            onclick: move |_| update_visit_status(country.name.clone(), VisitStatus::Lived),
                            "Lived"
                        }
                    }
                }
            })}
        }
    }
}