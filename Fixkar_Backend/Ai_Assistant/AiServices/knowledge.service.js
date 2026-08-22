import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AiKnowledge folder ka path
const knowledgeDir = path.join(__dirname, "../AiKnowledge");

export const loadKnowledgeBase = async () => {
  try {
    const files = await fs.readdir(knowledgeDir);

    const markdownFiles = files.filter((file) => file.endsWith(".md"));

    const knowledgeParts = [];
    

    for (const file of markdownFiles) {
      const filePath = path.join(knowledgeDir, file);
      const content = await fs.readFile(filePath, "utf-8");

      knowledgeParts.push(`
========================================
KNOWLEDGE FILE: ${file}
========================================

${content}
`);
    }

    return knowledgeParts.join("\n");
  } catch (error) {
    console.error("Knowledge Base Error:", error);
    throw new Error("Failed to load Fixkar knowledge base");
  }
};