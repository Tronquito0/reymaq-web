const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  return new Response(
    JSON.stringify({
      error:
        "ARCA billing is not configured yet. Required: CUIT, point of sale, WSAA certificate/private key and WSFEV1 production or homologation credentials."
    }),
    {
      status: 501,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
});
