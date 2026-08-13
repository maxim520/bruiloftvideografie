type JsonLdProps = {
  data: object;
};

/**
 * Rendert JSON-LD structured data als <script>-tag, volgens Next's eigen
 * aanbevolen patroon. JSON.stringify saniteert geen kwaadaardige strings;
 * "<" wordt daarom vervangen door de unicode-escape "\u003c", precies zoals
 * Next's documentatie voor JSON-LD voorschrijft — relevant hier omdat de
 * content (bedrijfsnaam, paginatitels) uit Sanity komt, niet uit code.
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
