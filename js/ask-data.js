/* ==========================================================================
   Ask Oren: the questions and answers behind the chat button.
   Every answer is written by hand; nothing is generated. A question whose
   answer is null stays hidden until it is filled in.

   q / a      the question and the answer, in English (en) and Chinese (zh).
              Separate paragraphs in an answer with a blank line ("\n\n").
   page       optional: on that page the question is offered first.
   next       follow-up questions offered after this answer.
   ========================================================================== */

window.ASK_OREN = {
  // Shown under every answer as "Still curious? Message me". Leave "" to hide.
  contactUrl: "",

  // Offered when the panel opens (after the current page's own question).
  starters: ["role", "complex", "looking", "contact"],

  questions: [
    {
      id: "role",
      q: {
        en: "What was your role on these projects?",
        zh: "你在這些專案裡負責什麼？",
      },
      a: {
        en: "All three are for Teahouse Finance, a DeFi protocol, from 2022 to 2026 in Taipei.\n\nOn HighTable I was the creative director: the archetype world, the personality quiz, the NFT mint and the real-world events. On Teahouse.Finance I was the product designer: brand, design system, and the deposit and withdraw flows for Pools and Easy-Earn. On Tea-REX I was the sole designer: sub-brand, mascot, design system and every screen on desktop and mobile.",
        zh: "三個專案都是為 DeFi 協議 Teahouse Finance 做的，時間是 2022 到 2026 年，在台北。\n\nHighTable 我是創意總監，負責角色世界觀、性格測驗、NFT 鑄造網站和實體活動。Teahouse.Finance 我是產品設計師，負責品牌、設計系統，以及 Pools 和 Easy-Earn 的存提款流程。Tea-REX 我是唯一的設計師，從子品牌、吉祥物、設計系統到桌機和手機的每一個畫面都是我做的。",
      },
      next: ["teahouse-what", "brand-to-product", "looking"],
    },
    {
      id: "teahouse-what",
      q: {
        en: "What is Teahouse Finance?",
        zh: "Teahouse Finance 是什麼樣的公司？",
      },
      a: {
        en: "A Taipei-based DeFi asset manager. It works like a hedge fund you reach through a wallet: you deposit, algorithmic strategies manage the liquidity position for you, and you can withdraw anytime. Investors choose between low-, medium- and high-risk strategies.\n\nIn April 2023 it raised a US$2 million round led by AppWorks, bringing total funding to about US$5 million, with earlier backers including Pantera Capital.",
        zh: "Teahouse 是一家台灣的 DeFi 資產管理新創，像一個透過錢包就能使用的避險基金：你存入資金，演算法策略替你管理流動性部位，隨時可以提領。投資人可以在低、中、高風險的策略之間選擇。\n\n2023 年 4 月，Teahouse 完成由 AppWorks 領投的 200 萬美元募資，累計募資約 500 萬美元，早期投資人包括 Pantera Capital。",
      },
      next: ["results", "role", "complex"],
    },
    {
      id: "complex",
      q: {
        en: "How do you make complex products easy to use?",
        zh: "你怎麼讓複雜的產品變得好用？",
      },
      a: {
        en: "I start by asking who is confused, and by what. DeFi doesn't lose people on visuals; it loses them on comprehension.\n\nOn Teahouse that meant two front doors to the same vaults. Pools speaks to liquidity providers in their own terms. Easy-Earn asks one question, which coin do you hold, and never uses a word like \"fee tier\".\n\nThen I design the failures as carefully as the happy path. Wrong chain, rejected signature, no gas: every screen says what happened, whether it cost you anything, and what to press next.",
        zh: "我會先問：是誰看不懂？看不懂什麼？DeFi 流失使用者不是因為畫面不好看，而是因為看不懂。\n\n在 Teahouse，這代表同一組金庫要開兩扇門。Pools 用流動性提供者熟悉的語言溝通；Easy-Earn 只問一個問題：你手上有哪種幣？完全不用「手續費等級」這類術語。\n\n接著，我把出錯的情況設計得和順利的流程一樣仔細。鏈選錯、簽名被拒、gas 不夠，每個畫面都會說明發生了什麼、有沒有讓你損失，以及下一步該按哪裡。",
      },
      next: ["users", "tearex-mascot", "role"],
    },
    {
      id: "brand-to-product",
      q: {
        en: "Can you take a product from brand to shipped UI?",
        zh: "你能從品牌一路做到上線的介面嗎？",
      },
      a: {
        en: "Yes, that's most of what I did at Teahouse. I drew the Teahouse mark, a tea leaf sprouting as one unbroken line, and it carries across Easy-Earn, Pools and Tea-REX.\n\nOn Tea-REX I went all the way down: sub-brand and mascot, then primitive and semantic tokens, then components with every state drawn, then five product areas on desktop and mobile. The brand doesn't stop at the marketing site; it shows up in the leverage slider and the error states.",
        zh: "可以，這正是我在 Teahouse 大部分的工作。Teahouse 的標誌是我畫的：一片用一筆不斷的線畫成的茶葉嫩芽，延伸到 Easy-Earn、Pools 和 Tea-REX。\n\nTea-REX 我從頭做到底：先做子品牌和吉祥物，再建立基礎和語意 token，接著做出畫好所有狀態的元件，最後完成桌機和手機上的五個產品區塊。品牌不只停在行銷網站上，連槓桿滑桿和錯誤狀態裡都看得到。",
      },
      next: ["design-system", "tearex-mascot", "looking"],
    },
    {
      id: "users",
      q: {
        en: "How do you get to know users you can't see?",
        zh: "看不到使用者的時候，你怎麼了解他們？",
      },
      a: {
        en: "In DeFi everyone is an anonymous wallet: no accounts, no emails. On HighTable we let people sort themselves instead.\n\nA free two-minute personality quiz assigned one of four archetypes, each matching a risk appetite. The archetype became a Discord role, the role opened a channel, and the channel led to small events in Taipei. By the end, 5,587 anonymous wallets had told us who they were, and that list became the user segments for the Teahouse product.",
        zh: "在 DeFi 裡，每個人都只是匿名錢包，沒有帳號、沒有 email。所以在 HighTable，我們讓使用者自己分類。\n\n一個免費、兩分鐘的性格測驗會分配四種角色之一，每種對應一種風險偏好。角色變成 Discord 身分組，身分組打開對應的頻道，頻道再連到台北的小型實體活動。最後，5,587 個匿名錢包告訴了我們他們是誰，這份名單也成了 Teahouse 產品的使用者分群。",
      },
      next: ["hightable-why", "complex", "role"],
    },
    {
      id: "hightable-why",
      page: "hightable",
      q: {
        en: "Why did HighTable start from the vaults, not the art?",
        zh: "HighTable 為什麼從金庫出發，而不是先做美術？",
      },
      a: {
        en: "Most NFT projects make the art first and look for utility later. We did it backward: every character unlocks a specific strategy tier, so the look follows the risk. The Gambler looks risky because it unlocks the high-risk vault.\n\nThat made the collection a way into the product rather than a side project. Holders learned how the strategies work in their channels, then started using Teahouse.",
        zh: "大部分 NFT 專案是先做美術，之後才找用途。我們反過來：每個角色對應一個特定的策略等級，所以外型跟著風險走。賭徒看起來很冒險，是因為它解鎖的就是高風險金庫。\n\n這讓整個系列成為進入產品的入口，而不是附帶的周邊。持有者在自己的頻道裡學會策略怎麼運作，接著就開始使用 Teahouse。",
      },
      next: ["users", "brand-to-product", "role"],
    },
    {
      id: "teahouse-two-doors",
      page: "teahouse",
      q: {
        en: "Why build two products on one engine?",
        zh: "為什麼同一套引擎要做成兩個產品？",
      },
      a: {
        en: "Because the right question depends on who's asking. A liquidity provider arrives asking, \"What's the risk-adjusted yield on this pair?\" Someone holding ETH asks, \"Where can my ETH earn something?\"\n\nThe vaults are identical. What changes is how much each site explains, and in which words. Pools shows every figure and filter; Easy-Earn shows one card per coin. The drop-off was at the deposit, so the goal was to get one person with one coin all the way through without learning anything first.",
        zh: "因為該問什麼問題，取決於是誰在問。流動性提供者一進來就問：「這個交易對的風險調整後收益是多少？」手上有 ETH 的人問的是：「我的 ETH 能放在哪裡生利息？」\n\n金庫完全一樣，不同的是每個網站解釋多少、用什麼字。Pools 呈現每個數字和篩選條件；Easy-Earn 每種幣只有一張卡片。流失發生在存款那一步，所以目標是讓一個人帶著一種幣，不必先學任何東西就能完成存款。",
      },
      next: ["complex", "users", "role"],
    },
    {
      id: "tearex-mascot",
      page: "tearex",
      q: {
        en: "Doesn't a mascot make a trading app less serious?",
        zh: "交易介面放吉祥物，不會顯得不專業嗎？",
      },
      a: {
        en: "Only if it touches the numbers, so it doesn't. Rex lives in labels, empty states and rewards. He never touches a price or a liquidation warning. That line is the system.\n\nWhere he does show up, he does a job: his mood tells you how your position is doing before you read a figure. Remove the dinosaur and the components still work. Keep him and you remember which app you're using, which matters when most terminals look the same.",
        zh: "只有在吉祥物碰到數字時才會，所以我不讓它碰。Rex 只出現在標籤、空白狀態和獎勵裡，從不碰價格或清算警告。這條界線就是整個系統的規則。\n\n它出現的地方都有作用：Rex 的表情讓你在看數字之前，就知道部位狀況好不好。拿掉恐龍，元件照樣能用；留著它，你會記得自己在用哪個 app。在大部分交易介面都長得一樣的情況下，這很重要。",
      },
      next: ["design-system", "brand-to-product", "complex"],
    },
    {
      id: "design-system",
      q: {
        en: "How do you set up a design system?",
        zh: "你怎麼建立設計系統？",
      },
      a: {
        en: "Tokens first, components second. Primitive tokens hold the raw colors. Semantic tokens give each one a job: surface/action says \"action\", not \"purple\". Components only use semantic tokens, so changing the brand color is one edit, not two hundred.\n\nThen I draw every state rather than describing it: default, hover, loading, disabled. And I test the system by building real pages from it, like the Tea-REX Rewards page on desktop and mobile.",
        zh: "先做 token，再做元件。基礎 token 存放原始色彩；語意 token 賦予每個顏色一個用途，例如 surface/action 代表「行動」，而不是「紫色」。元件只使用語意 token，所以換品牌色只要改一個地方，不用改兩百個。\n\n接著，我會把每個狀態實際畫出來，而不是只用文字描述：預設、hover、載入中、停用。最後用它做出真實頁面來驗證系統，例如 Tea-REX 桌機和手機版的 Rewards 頁面。",
      },
      next: ["brand-to-product", "tearex-mascot", "looking"],
    },

    // ---- Only Oren can answer these. Hidden until the answer is filled in. ----
    {
      id: "looking",
      q: {
        en: "What kind of role are you looking for?",
        zh: "你現在在找什麼樣的工作？",
      },
      a: {
        en: "Next, I want to design AI products. After four years in DeFi, I'm ready to move on from crypto, and AI is where I want to go.\n\nI'm open to full-time roles, and freelance or contract projects are very welcome too.",
        zh: "下一步，我想做 AI 產品。在 DeFi 待了四年，我準備離開加密貨幣領域，AI 是我最期待的方向。\n\n全職職位我都考慮，也非常歡迎接案或合約形式的合作。",
      },
      next: ["location", "contact", "role"],
    },
    {
      id: "location",
      q: {
        en: "Where are you based? Are you open to remote work?",
        zh: "你在哪裡？可以遠端工作嗎？",
      },
      a: {
        en: "I'm based in Linkou, New Taipei, Taiwan (GMT+8). Remote is how I'm used to working, so working across time zones isn't new to me.",
        zh: "我住在台灣新北市林口（GMT+8）。遠端是我習慣的工作型態，跨時區合作對我來說並不陌生。",
      },
      next: ["looking", "contact"],
    },
    {
      id: "background",
      q: {
        en: "What did you do before Teahouse?",
        zh: "加入 Teahouse 之前你做什麼？",
      },
      a: {
        en: "Before Teahouse I had ten years of experience across user research, usability engineering and design management.\n\nThat's why my projects start with who the user is and where they get stuck, before any screen is drawn.",
        zh: "加入 Teahouse 之前，我已有十年工作經驗，橫跨使用者研究、易用性工程和設計管理。\n\n所以我的專案總是先釐清使用者是誰、卡在哪裡，然後才開始畫畫面。",
      },
      next: ["role", "looking"],
    },
    {
      id: "results",
      q: {
        en: "What results did these projects have?",
        zh: "這些專案有什麼成果？",
      },
      a: {
        en: "Teahouse's total value locked peaked at US$9.17 million on 30 July 2024, according to DefiLlama. In its Q1 2024 update, the team reported assets under management above US$7.5 million.\n\nOn HighTable, 5,587 passes went to holders: 5,566 VIP and 21 OG, each one a wallet that told us who it was.",
        zh: "根據 DeFi 數據平台 DefiLlama，Teahouse 的總鎖倉量（TVL）在 2024 年 7 月 30 日達到歷史高點 917 萬美元。團隊在 2024 年第一季的更新中也公布，資產管理規模（AUM）超過 750 萬美元。\n\nHighTable 共發出 5,587 張通行證：5,566 張 VIP、21 張 OG，每一張背後都是一個願意告訴我們自己是誰的錢包。",
      },
      next: ["complex", "looking"],
    },
    {
      id: "contact",
      q: {
        en: "How can I reach you?",
        zh: "怎麼聯絡你？",
      },
      a: null, // TODO: LinkedIn / email, and whether a resume is available
      next: ["looking", "role"],
    },
  ],
};
