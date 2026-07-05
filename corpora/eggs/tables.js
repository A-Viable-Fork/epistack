// Role: the eggs case reference tables (trusted inputs, intake data model v3, Section 10). The source
//   table carries a row per cited study or body, with its source class and full citation as provenance;
//   the kind table gives the two ceilings the eggs domains use: a measurement floor and a forum band.
// Contract: exports SOURCES (source-table rows) and KINDS (kind-table rows). Pure data; corpora
//   imports nothing. Consumed by build/check-eggs.mjs, which builds the domain and composite stores.
// Invariant: every claim's source_id resolves to a row here, so every claim carries its provenance.
"use strict";

// the two kinds the eggs case grounds through: a measurement floor (ceiling checked) and a forum band
// (ceiling corroborated). A characterized gap is a measurement-kind claim held below its floor by a
// weak transfer support plus a closing condition (Prompt 18).
const KINDS = [
  { kind: "measurement", ceiling: "checked" },
  { kind: "forum", ceiling: "corroborated" },
];

// the sources, one row per study/body cited by a claim. source_class is the v3 vocabulary; the
// description is the citation the document states, so provenance travels with every claim.
const SOURCES = [
  // ---- nutrition ----
  { source_id: "src:weggemans-2001", source_class: "peer-reviewed", description: "Weggemans, Zock & Katan (2001), Am J Clin Nutr 73(5):885-891" },
  { source_id: "src:howell-1997", source_class: "peer-reviewed", description: "Howell et al. (1997), Am J Clin Nutr 65(6):1747-1764" },
  { source_id: "src:hopkins-1992", source_class: "peer-reviewed", description: "Hopkins (1992), Am J Clin Nutr 55(6):1060-1070" },
  { source_id: "src:berger-2015", source_class: "peer-reviewed", description: "Berger et al. (2015), Am J Clin Nutr 102(2):276-294" },
  { source_id: "src:blesso-2013", source_class: "peer-reviewed", description: "Blesso et al. (2013), J Clin Lipidol 7(5):463-471 (metabolic syndrome RCT)" },
  { source_id: "src:fuller-2015", source_class: "peer-reviewed", description: "Fuller et al. (2015), DIABEGG, Am J Clin Nutr 101(4):705-713 (T2D RCT)" },
  { source_id: "src:usda-fdc", source_class: "dataset", description: "USDA FoodData Central SR Legacy, FDC ID 171287 (egg, whole, raw)" },
  { source_id: "src:katan-1986", source_class: "peer-reviewed", description: "Katan et al. (1986), Am J Epidemiol 123(2):221-234 (responder variance)" },
  { source_id: "src:griffin-2021", source_class: "peer-reviewed", description: "Griffin et al. (2021), Proc Nutr Soc 80(2):142-149 (unimodal response)" },
  { source_id: "src:williams-2005", source_class: "peer-reviewed", description: "Williams et al. (2005), ATVB 25(7):1532 (twin heritability of response)" },
  { source_id: "src:drouin-2020", source_class: "peer-reviewed", description: "Drouin-Chartier et al. (2020), BMJ 368:m513 (null egg-CVD, 28 cohorts)" },
  { source_id: "src:tran-2022", source_class: "peer-reviewed", description: "Tran et al. (2022), Circulation 145(20):e771 (dietary-cholesterol/CVD harm)" },
  { source_id: "src:godos-2021", source_class: "peer-reviewed", description: "Godos et al. (2021), Eur J Nutr 60(4):1833-1848 (dose-response; diabetic subgroup)" },
  { source_id: "src:shin-2013", source_class: "peer-reviewed", description: "Shin et al. (2013), Atherosclerosis 229(2):524-530 (diabetic subgroup)" },
  { source_id: "src:aha-2020", source_class: "institutional-report", description: "Carson et al. (2020), AHA Science Advisory, Circulation 141(3):e39-e53" },
  { source_id: "src:dga-2015", source_class: "institutional-report", description: "2015-2020 Dietary Guidelines for Americans; 2015 DGAC Scientific Report" },

  // ---- nutrition, deepened (Prompt 26): choline, metabolic regulation, lipid mechanistic floor ----
  { source_id: "src:wallace-2016", source_class: "peer-reviewed", description: "Wallace & Fulgoni (2016/2017), J Am Coll Nutr / Nutrients 9(8):839 (NHANES choline intake, adequacy)" },
  { source_id: "src:zeisel-2006", source_class: "peer-reviewed", description: "Zeisel & da Costa (2006/2009); Corbin & Zeisel (2012) (choline, VLDL export, NAFLD depletion-repletion)" },
  { source_id: "src:caudill-2018", source_class: "peer-reviewed", description: "Caudill et al. (2018), FASEB J; Bahnfleth et al. (2022), FASEB J (maternal choline RCT, offspring cognition)" },
  { source_id: "src:fanelli-2024", source_class: "peer-reviewed", description: "Fanelli, Martins & Stein (2024), J Nutr Sci (egg DIAAS >100, ileal-cannulated pigs; additivity)" },
  { source_id: "src:layman-2003", source_class: "peer-reviewed", description: "Layman (2003), J Nutr; USDA FoodData Central (leucine content, mTORC1)" },
  { source_id: "src:ratliff-2010", source_class: "peer-reviewed", description: "Ratliff et al. (2010), Nutr Res 30(2):96-103 (egg breakfast, ghrelin/PYY/insulin AUC)" },
  { source_id: "src:vanderwal-2005", source_class: "peer-reviewed", description: "Vander Wal et al. (2005), J Am Coll Nutr; Dhurandhar & Vander Wal (2008) (egg breakfast satiety, weight loss)" },
  { source_id: "src:liu-2015", source_class: "peer-reviewed", description: "Liu et al. (2015), Nutrients; Bannon/Kral et al. (2015) (egg satiety, adolescent behavioral decoupling)" },
  { source_id: "src:maki-2017", source_class: "peer-reviewed", description: "Maki et al. (2017), J Nutr; Pourafshar et al. (2018) (egg glycemic/insulin sensitivity, HOMA-IR)" },
  { source_id: "src:brown-yu-2010", source_class: "peer-reviewed", description: "Brown & Yu (2010); Lutjohann et al. (2022) (fractional cholesterol absorption, NPC1L1/ABCG5-8)" },
  { source_id: "src:kratky-2018", source_class: "peer-reviewed", description: "Kratky et al. (2018); McNamara (2000); Kostner (2020) (compensatory synthesis downregulation, SCAP-SREBP2)" },
  { source_id: "src:herron-2006", source_class: "peer-reviewed", description: "Herron et al. (2006); Beynen & Katan (1985) (hypo/hyper responder distribution, APOE E4)" },

  // ---- environment (farming and regenerative documents) ----
  { source_id: "src:leinonen-2012", source_class: "peer-reviewed", description: "Leinonen et al. (2012), Poultry Science 91(1):8-25 (UK egg-system LCA)" },
  { source_id: "src:wur-eggs", source_class: "dataset", description: "WUR egg LCA factsheet; De Vries & De Boer (2010), Livestock Science (land per kg egg)" },
  { source_id: "src:efsa-2023", source_class: "institutional-report", description: "EFSA AHAW Panel (2023), EFSA Journal 21(2):e07789 (laying-hen welfare)" },
  { source_id: "src:thofner-2021", source_class: "peer-reviewed", description: "Thofner et al. (2021), PLOS ONE (keel-bone necropsy, 4,794 birds)" },
  { source_id: "src:ager-2023", source_class: "peer-reviewed", description: "Ager et al. (2023), Nature-family AMR meta-analysis (72 studies, 22 countries)" },
  { source_id: "src:panagos-2024", source_class: "peer-reviewed", description: "Panagos et al. (2024), Geoderma (soil-health survey, 6,000+ samples)" },
  { source_id: "src:outhwaite-2022", source_class: "peer-reviewed", description: "Outhwaite et al. (2022), Nature 605:97-102 (biodiversity vs land-use intensity)" },
  { source_id: "src:epa-2011", source_class: "institutional-report", description: "EPA (2011); Baram (2014) (manure-lagoon nitrate under confined systems)" },
  { source_id: "src:van-wagenberg-2017", source_class: "peer-reviewed", description: "van Wagenberg et al. (2017), Animal Board Invited Review (179 articles)" },
  { source_id: "src:mekonnen-2012", source_class: "peer-reviewed", description: "Mekonnen & Hoekstra (2012), Ecosystems 15(3):401-415 (water footprint)" },
  { source_id: "src:leip-2015", source_class: "peer-reviewed", description: "Leip et al. (2015), Environmental Research Letters 10:115004 (spatial scale)" },
  { source_id: "src:raposo-2025", source_class: "peer-reviewed", description: "Raposo (2025), Sustainability 17(3):1223 (improved-pasture SOC, IPCC Tier 1, 7,092 sites)" },
  { source_id: "src:yang-2019", source_class: "peer-reviewed", description: "Yang et al. (2019), J Cleaner Production (poultry-litter C retention on corn)" },
  { source_id: "src:soares-2022", source_class: "peer-reviewed", description: "Soares et al. (2022) (no SOC increase from laying-hen integration; litter C:N 3.88)" },
  { source_id: "src:axis-r48610", source_class: "institutional-report", description: "Congressional Research Service R48610; Newton et al. (2020) (regenerative axis definition)" },
  { source_id: "src:savory-advocacy", source_class: "testimony", description: "Savory Institute / Teague advocacy claims (2.5-9 t C/ha/yr), per McGuire (2018) WSU critique" },

  // ---- economics (net-energy document) ----
  { source_id: "src:wiedemann-2011", source_class: "peer-reviewed", description: "Wiedemann & McGahan (2011), Australian egg-production LCA (FCR, CED)" },
  { source_id: "src:syc-2022", source_class: "peer-reviewed", description: "Syc et al. (2022), Agriculture 12(3):355 (egg yield, battery vs organic)" },
  { source_id: "src:turner-2022", source_class: "peer-reviewed", description: "Turner et al. (2022), Canada egg LCA (organic lowest in 9/10 categories)" },
  { source_id: "src:pelletier-2016", source_class: "peer-reviewed", description: "Pelletier et al. (2016), Poultry Science (US egg-industry footprint, EROI)" },
  { source_id: "src:elson-costs", source_class: "peer-reviewed", description: "Elson (1985); Tserveni-Gousi et al. (organic vs caged egg production cost)" },
  { source_id: "src:nordhaus-stern", source_class: "peer-reviewed", description: "Nordhaus (4.3%); Stern (2006, 1.4%); Weitzman (discount-rate disagreement)" },
  { source_id: "src:franzese-2009", source_class: "peer-reviewed", description: "Franzese et al. (2009), Ecological Modelling (GER vs Emergy incommensurability)" },
];

module.exports = { KINDS, SOURCES };
