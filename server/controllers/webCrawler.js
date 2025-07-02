import "dotenv/config";
import { embedAndStoreChunks } from "../services/ragService.js";
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";


// For single page crawling and extracting text

export const webCrawler = async (req, res) => {
    try {
        const URL = req.body.URL;
        console.log("Website URL received: ", URL);
        const websiteName = URL.replace(/https?:\/\//, "").split("/")[0];
        
        const loader = new PlaywrightWebBaseLoader(URL, {
            launchOptions: { headless: true },
            gotoOptions: { waitUntil: "networkidle" },
            evaluate: async (page) => {
                // This function runs in the browser context
                return await page.evaluate(() => {
                    const main = document.querySelector("main") || document.body;
                    return main.innerText;
                });
            },
        });
        const docs = await loader.load();

        if (!docs || docs.length === 0) {
            return res.status(404).json({ error: "Can't crawl this website" });
        }
        const rawText = docs?.map((doc) => doc.pageContent).join("\n");
        let collectionName = websiteName + Date.now();
        await embedAndStoreChunks(rawText, websiteName, collectionName);
        res.status(200).json({ status: `${websiteName} extracted and embedded`, rawText, embeddingName: collectionName });
    } catch (error) {
        console.error("Error in webCrawler:", error);
        res.status(500).json({ error: "Failed to crawl the website" });
    }
}



// // For Crawling websites and extracting text and links
// export const webCrawler = async (req, res) => {
//   try {
//     const URL = req.body.URL;
//     console.log("Website URL received: ", URL);

//     const visited = new Set();

//     const crawl = async (url, depth = 1, maxDepth = 2) => {
//       if (visited.has(url) || depth > maxDepth) return [];
//       visited.add(url);

//       const loader = new PlaywrightWebBaseLoader(url, {
//         launchOptions: { headless: true },
//         gotoOptions: { waitUntil: "networkidle" },
//         evaluate: async (page) => {
//           return await page.evaluate(() => {
//             const main = document.querySelector("main") || document.body;
//             const text = main.innerText;
//             const links = Array.from(document.querySelectorAll("a"))
//               .map((a) => a.href)
//               .filter((href) =>
//                 href.startsWith(location.origin) &&
//                 !href.includes("#") &&
//                 !href.includes("mailto:")
//               );
//             return JSON.stringify({ text, links });
//           });
//         },
//       });

//       const result = await loader.load();
//       const { text, links } = JSON.parse(result[0].pageContent);

//       const docs = [{ pageContent: text, metadata: { url } }];
//       for (const link of links) {
//         const childDocs = await crawl(link, depth + 1, maxDepth);
//         docs.push(...childDocs);
//       }

//       return docs;
//     };

//     const allDocs = await crawl(URL);

//     console.log("Total pages crawled:", visited.size);
//     return res.status(200).json({
//       status: "Web crawling completed",
//       data: allDocs,
//     });
//   } catch (error) {
//     console.error("Error in webCrawler:", error);
//     res.status(500).json({ error: "Failed to crawl the website" });
//   }
// };

// For single page crawling and extracting text
