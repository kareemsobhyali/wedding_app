const fs = require("fs");
let c = fs.readFileSync("apps/web/src/app/create/page.tsx", "utf8");

const mediaFn = `
  const handleMediaLink = async (e: any, url: string, type: "IMAGE" | "AUDIO", role: "COVER" | "ORIGINAL") => {
    e.preventDefault();
    if (!url) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      await fetch(\`\${apiUrl}/public/media/link\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url, type, role })
      });
      alert("Media linked successfully!");
    } catch (err) {
      alert("Failed to link media");
    }
  };
`;

c = c.replace("const [submitError, setSubmitError] = useState(\"\");", "const [submitError, setSubmitError] = useState(\"\");\n" + mediaFn);

const uiCode = `
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-bold">Media (Optional)</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <div className="flex gap-2">
            <input 
              type="url" 
              id="coverImgUrl"
              placeholder="https://example.com/image.jpg"
              className="flex-1 p-2 border rounded"
            />
            <button onClick={(e) => handleMediaLink(e, (document.getElementById("coverImgUrl") as HTMLInputElement).value, "IMAGE", "COVER")} className="bg-indigo-600 text-white px-4 rounded">Set Image</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Music URL</label>
          <div className="flex gap-2">
            <input 
              type="url" 
              id="audioUrl"
              placeholder="https://example.com/music.mp3"
              className="flex-1 p-2 border rounded"
            />
            <button onClick={(e) => handleMediaLink(e, (document.getElementById("audioUrl") as HTMLInputElement).value, "AUDIO", "ORIGINAL")} className="bg-indigo-600 text-white px-4 rounded">Set Music</button>
          </div>
        </div>
      </div>
`;

c = c.replace("</form>", uiCode + "\n      </form>");
fs.writeFileSync("apps/web/src/app/create/page.tsx", c);

