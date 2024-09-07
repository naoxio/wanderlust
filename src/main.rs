#![allow(non_snake_case)]

use dioxus_logger::tracing::{Level, info};

use dioxus::prelude::*;

mod app;
mod geojson_handler;
mod models;
mod map_renderer;

fn main() {
    dioxus_logger::init(Level::INFO).expect("logger failed to init");

    info!("starting app");
    launch(app::App);
}
