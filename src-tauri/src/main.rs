// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use std::fs;
use std::path::Path;

#[tauri::command]
fn create_folder(dir_path: &str) -> Result<(), String> {
    fs::create_dir_all(dir_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn select_folder() -> String {
    let result = nfd::open_pick_folder(None).unwrap();
    match result {
        nfd::Response::Okay(folder_path) => folder_path,
        nfd::Response::OkayMultiple(_) => "Multiple files selected".to_string(),
        nfd::Response::Cancel => "".to_string(),
    }
}

#[tauri::command]
fn open_folder(path: &str) -> Result<(), String> {
    open::that(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_file(filePath: &str, content: &str) -> Result<(), String> {
    // Ensure the directory exists
    if let Some(parent) = Path::new(filePath).parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(filePath, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_file(filePath: &str) -> Result<String, String> {
    fs::read_to_string(filePath).map_err(|e| e.to_string())
}

#[tauri::command]
fn file_exists(filePath: &str) -> bool {
    Path::new(filePath).exists()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_folder,
            select_folder,
            open_folder,
            write_file,
            read_file,
            file_exists
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
