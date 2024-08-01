// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use ignore::WalkBuilder;
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
fn write_file(path: &str, content: &str) -> Result<(), String> {
    // Ensure the directory exists
    if let Some(parent) = Path::new(path).parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_file(path: &str) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn file_exists(path: &str) -> bool {
    Path::new(path).exists()
}

#[tauri::command]
fn run_script(script: String) -> Result<String, String> {
    use std::process::Command;

    let output = Command::new("sh")
        .arg("-c")
        .arg(&script)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn read_files_in_directory(path: String) -> Result<Vec<String>, String> {
    let mut files = Vec::new();

    fn visit_dirs(dir: &Path, files: &mut Vec<String>) -> std::io::Result<()> {
        if dir.is_dir() {
            for entry in fs::read_dir(dir)? {
                let entry = entry?;
                let path = entry.path();
                if path.is_dir() {
                    visit_dirs(&path, files)?;
                } else {
                    if let Some(file_name) = path.to_str() {
                        files.push(file_name.to_string());
                    }
                }
            }
        }
        Ok(())
    }

    match visit_dirs(Path::new(&path), &mut files) {
        Ok(_) => Ok(files),
        Err(e) => Err(format!("Error reading directory: {}", e)),
    }
}

#[tauri::command]
fn scan_directory_with_gitignore(root: String) -> Result<Vec<String>, String> {
    let root_path = Path::new(&root);
    let mut files = Vec::new();

    let walker = WalkBuilder::new(root_path)
        .hidden(false) // Show hidden files
        .git_ignore(true) // Use .gitignore files
        .git_global(true) // Use global gitignore file
        .git_exclude(true) // Use .git/info/exclude file
        .ignore(true) // Use .ignore files
        .filter_entry(|entry| {
            let file_name = entry.file_name().to_str().unwrap_or("");
            !file_name.eq_ignore_ascii_case(".git") // Ignore .git files and directories
        })
        .build();

    for entry in walker {
        match entry {
            Ok(entry) => {
                let path = entry.path();
                if path.is_file() {
                    files.push(path.to_string_lossy().into_owned());
                }
            }
            Err(err) => eprintln!("Error: {}", err),
        }
    }

    Ok(files)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_folder,
            select_folder,
            open_folder,
            write_file,
            read_file,
            file_exists,
            run_script,
            read_files_in_directory,
            scan_directory_with_gitignore
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
