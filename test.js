import { GitBookAPI } from "@gitbook/api";

const gitbook = new GitBookAPI({
  authToken: "",
});

const SPACE_ID = "NhGxX3Ixt1T5VlFUUTc8";
const { data: topLevel } = await gitbook.spaces.listPages(SPACE_ID);

// Make this async
async function traverseNodes(nodes, level) {
  for (const node of nodes) {
    // Await recursive calls
    if (node.nodes && node.nodes.length > 0) {
      await traverseNodes(node.nodes, level + 1);
    } else if (node.leaves && node.leaves.length > 0) {
      for (const leaf of node.leaves) {
        console.log(`${" ".repeat(level * 4)}${leaf.text}`);
      }
    }
  }
}

async function traversePages(pages, level = 0) {
  for (const page of pages) {
    console.log(`${" ".repeat(level * 4)}${page.title} (${page.type})`);

    if (page.pages && page.pages.length > 0) {
      // Await the recursive call
      await traversePages(page.pages, level + 1);
    } else if (page.documentId) {
      const { data: content } = await gitbook.spaces.getDocumentById(
        SPACE_ID,
        page.documentId
      );

      if (content.nodes && content.nodes.length > 0) {
        await traverseNodes(content.nodes, level + 1);
      }
    }
  }
}

await traversePages(topLevel.pages);
