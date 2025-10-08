from livereload import Server

def main():
    # Livereload-Server starten
    server = Server()

    # Beobachte alle Dateien im src-Ordner (inkl. Unterordner)
    server.watch('../src/**/*.*')

    # Starte Server auf Port 5501, Root ist src/
    server.serve(root='src', port=5501, open_url_delay=1)

if __name__ == "__main__":
    main()
