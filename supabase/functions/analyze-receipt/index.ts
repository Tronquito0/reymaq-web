type ReceiptItem = {
  productName: string;
  quantity: number;
  unitCost: number;
  marginPercent?: number;
};

type OpenAIContent = {
  type?: string;
  text?: string;
};

type OpenAIOutput = {
  type?: string;
  content?: OpenAIContent[];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageDataUrl, textHint } = await req.json();
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_VISION_MODEL") || "gpt-4.1-mini";

    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY in Supabase Edge Function secrets.");
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        text: {
          format: {
            type: "json_schema",
            name: "supplier_receipt",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                supplierName: { type: "string" },
                receiptNumber: { type: "string" },
                receiptDate: { type: "string" },
                total: { type: "number" },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      productName: { type: "string" },
                      quantity: { type: "number" },
                      unitCost: { type: "number" }
                    },
                    required: ["productName", "quantity", "unitCost"]
                  }
                }
              },
              required: ["supplierName", "receiptNumber", "receiptDate", "total", "items"]
            }
          }
        },
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Extrae de este remito de proveedor argentino: proveedor, fecha, numero de remito/factura, total y productos. " +
                  "Para cada producto devuelve nombre, cantidad y costo unitario sin simbolo de moneda. " +
                  "Si solo aparece total de linea, estima unitCost dividiendo por cantidad. " +
                  "Ignora IVA, percepciones, subtotales, descuentos generales y texto legal. " +
                  "Si un dato no aparece, usa string vacio o 0. " +
                  (textHint ? `Texto adicional: ${textHint}` : "")
              },
              { type: "input_image", image_url: imageDataUrl, detail: "high" }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();
    const outputText =
      result.output_text ||
      (result.output || [])
        .flatMap((item: OpenAIOutput) => item.content || [])
        .filter((content: OpenAIContent) => content.type === "output_text" || content.text)
        .map((content: OpenAIContent) => content.text || "")
        .join("");

    const parsed = JSON.parse(outputText.trim());
    const items: ReceiptItem[] = (parsed.items || []).map((item: ReceiptItem) => ({
      productName: item.productName || "",
      quantity: Number(item.quantity || 0),
      unitCost: Number(item.unitCost || 0),
      marginPercent: Number(item.marginPercent || 35)
    }));

    return new Response(JSON.stringify({ ...parsed, items }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
