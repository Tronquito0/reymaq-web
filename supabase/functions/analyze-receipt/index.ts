type ReceiptItem = {
  productName: string;
  quantity: number;
  unitCost: number;
  marginPercent?: number;
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
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Extrae de este remito de proveedor: proveedor, fecha, numero de remito y productos. Devuelve SOLO JSON valido con forma { supplierName, receiptNumber, receiptDate, items:[{productName, quantity, unitCost}] }. Si un dato no aparece, usa string vacio o 0. " +
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
    const outputText = result.output_text || "";
    const parsed = JSON.parse(outputText.replace(/^```json|```$/g, "").trim());
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
