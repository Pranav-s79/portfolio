Resume PDFs served through the deploy base path (see `resume.downloads` in
`src/data/portfolio.js`):

- `Senthilkumar,Pranav - Resume.pdf` — linked as "Software resume here!"
- `resume-hardware.pdf` — linked as "Hardware resume here!"

Filenames are passed through `encodeURI`, so spaces and commas are safe.
