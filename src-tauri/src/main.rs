// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use ignore::gitignore::{Gitignore, GitignoreBuilder};
use std::collections::HashSet;
use std::fs;
use std::io::{self, BufRead};
use std::path::Path;
use walkdir::WalkDir;

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

fn parse_gitignore(path: &Path) -> io::Result<Gitignore> {
    let mut builder = GitignoreBuilder::new(path.parent().unwrap_or(Path::new("")));
    let file = fs::File::open(path)?;
    for line in io::BufReader::new(file).lines() {
        builder
            .add_line(None, &line?)
            .map_err(|e| io::Error::new(io::ErrorKind::Other, e))?;
    }
    builder
        .build()
        .map_err(|e| io::Error::new(io::ErrorKind::Other, e))
}

fn should_ignore(path: &Path, gitignores: &[Gitignore]) -> bool {
    for gitignore in gitignores.iter().rev() {
        match gitignore.matched(path, path.is_dir()) {
            ignore::Match::None => {}
            ignore::Match::Ignore(_) => return true,
            ignore::Match::Whitelist(_) => return false,
        }
    }
    false
}

#[tauri::command]
fn scan_directory_with_gitignore(root: String) -> Result<Vec<String>, String> {
    let root_path = Path::new(&root);
    let mut gitignores = Vec::new();
    let mut files = Vec::new();
    let mut visited_dirs = HashSet::new();

    for entry in WalkDir::new(root_path).follow_links(false).into_iter() {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if should_ignore(path, &gitignores) {
            if path.is_dir() {
                continue;
            }
        } else {
            if path.is_dir() {
                visited_dirs.insert(path.to_path_buf());
            }

            if path.file_name() == Some(".gitignore".as_ref()) {
                match parse_gitignore(path) {
                    Ok(gitignore) => gitignores.push(gitignore),
                    Err(e) => eprintln!("Error parsing .gitignore at {:?}: {}", path, e),
                }
            } else if path.is_file() {
                files.push(path.to_string_lossy().into_owned());
            }
        }

        if path.is_dir() {
            if let Some(parent) = path.parent() {
                gitignores.retain(|g| g.path().starts_with(parent));
            }
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
