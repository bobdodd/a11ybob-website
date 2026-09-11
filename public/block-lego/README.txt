Blockly for Lego — a built copy.

Do not edit anything in this directory. It is generated from
https://github.com/bobdodd/Blockly-for-Lego and overwritten wholesale on
each deploy:

    cd editor
    npm run build
    rm -rf <site>/public/block-lego
    cp -R index.html viewer.html style.css viewer.css dist media ldraw \
          <site>/public/block-lego/

Served at /block-lego/index.html. The explicit filename matters: Next.js
strips the trailing slash from /block-lego/, and the app's asset paths are
relative, so they only resolve correctly when the URL ends in a filename.
A redirect in next.config.ts sends /block-lego to the right place.

dist/simulator-worker.js runs the hub simulator inside the browser, using
Pyodide loaded from the jsDelivr CDN on first connect (about 5MB, then
cached). It needs no server-side support, but it does need the page served
over HTTPS or from localhost, and no Content-Security-Policy that would
block a module worker or cdn.jsdelivr.net.

The ldraw/ directory is LEGO part geometry from the LDraw Parts Library,
used under CC BY 4.0. Its NOTICE and CAreadme.txt travel with it.
