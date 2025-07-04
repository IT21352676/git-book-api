import { GitBookAPI } from "@gitbook/api";

const gitbook = new GitBookAPI({
  authToken: "",
});

const SPACE_ID = "NhGxX3Ixt1T5VlFUUTc8";

//const data = await gitbook.spaces.listPages(SPACE_ID);

//console.log(data.data);

// const pageData = await gitbook.spaces.getPageById(
//   SPACE_ID,
//   "DLSKA2YgYk966czII3JC"
// );

gitbook.spaces.getDo;

//console.log(pageData.data.document.nodes[0].nodes[0].nodes[0].leaves);

// const printPagesWithContent = async (pages, depth = 0) => {
//   const indent = "  ".repeat(depth);

//   for (const page of pages) {
//     // console.log(`${indent}- ${page.title} (${page.type})`);

//     const pg = await gitbook.spaces.getPageById(SPACE_ID, page.id);
//     console.log(pg.data);

//     // If it's a real page (not a group), fetch its content
//     if (page.type === "page") {
//       try {
//         const { data: content } = await gitbook.pages.getPageContent(
//           SPACE_ID,
//           page.id
//         );
//         console
//           .log
//           //content
//           //   `${indent}  Content:\n${indent}  ${
//           //     content.markdown?.substring(0, 300) || "(no content)"
//           //   }`
//           ();
//       } catch (err) {
//         console.error(`${indent}  Failed to fetch content:`, err.message);
//       }
//     }

//     // Recursively check for subpages
//     if (page.pages && page.pages.length > 0) {
//       await printPagesWithContent(page.pages, depth + 1);
//     }
//   }
// };

const main = async () => {
  try {
    const { data: topLevel } = await gitbook.spaces.listPages(SPACE_ID);

    for (const secondLevel of topLevel.pages) {
      console.log(secondLevel.title);

      if (secondLevel.pages && secondLevel.pages.length > 0) {
        for (const thirdLevel of secondLevel.pages) {
          console.log(`      ${thirdLevel.title}`);

          if (thirdLevel.documentId && thirdLevel.type === "document") {
            try {
              const { data: content } = await gitbook.spaces.getDocumentById(
                SPACE_ID,
                thirdLevel.documentId
              );

              if (content.nodes && content.nodes.length > 0) {
                for (const node of content.nodes) {
                  if (node.nodes && node.nodes.length > 0) {
                    for (const subNode of node.nodes) {
                      if (subNode.leaves && subNode.leaves.length > 0) {
                        for (const leaf of subNode.leaves) {
                          console.log(`             ${leaf.text}`);
                        }
                      }
                    }
                  }
                }
              }
            } catch (err) {
              console.error(
                "Error fetching document:",
                thirdLevel.title,
                err.message
              );
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Top-level error:", err.response?.data || err.message);
  }
};

main();
