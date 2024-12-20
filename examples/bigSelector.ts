import {ask} from "../src"

const choices = [
"Meta-Llama-3.1-8B-Instruct-IQ2_M.gguf",
"Meta-Llama-3.1-8B-Instruct-IQ3_M.gguf",
"Meta-Llama-3.1-8B-Instruct-IQ3_XS.gguf",
"Meta-Llama-3.1-8B-Instruct-IQ4_NL.gguf",
"Meta-Llama-3.1-8B-Instruct-IQ4_XS.gguf",
"Meta-Llama-3.1-8B-Instruct-Q2_K.gguf",
"Meta-Llama-3.1-8B-Instruct-Q2_K_L.gguf",
"Meta-Llama-3.1-8B-Instruct-Q3_K_L.gguf",
"Meta-Llama-3.1-8B-Instruct-Q3_K_M.gguf",
"Meta-Llama-3.1-8B-Instruct-Q3_K_S.gguf",
"Meta-Llama-3.1-8B-Instruct-Q3_K_XL.gguf",
"Meta-Llama-3.1-8B-Instruct-Q4_0_4_4.gguf",
"Meta-Llama-3.1-8B-Instruct-Q4_0_4_8.gguf",
"Meta-Llama-3.1-8B-Instruct-Q4_0_8_8.gguf",
"Meta-Llama-3.1-8B-Instruct-Q4_K_L.gguf",
"Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf",
"Meta-Llama-3.1-8B-Instruct-Q4_K_S.gguf",
"Meta-Llama-3.1-8B-Instruct-Q5_K_L.gguf",
"Meta-Llama-3.1-8B-Instruct-Q5_K_M.gguf",
"Meta-Llama-3.1-8B-Instruct-Q5_K_S.gguf",
"Meta-Llama-3.1-8B-Instruct-Q6_K.gguf",
"Meta-Llama-3.1-8B-Instruct-Q6_K_L.gguf",
"Meta-Llama-3.1-8B-Instruct-Q8_0.gguf",
"Meta-Llama-3.1-8B-Instruct-f32.gguf",
]

const question = ask.select(
  "model", 
  "Choose a model:", 
  choices,
  { pageSize: 30 }
);

await question();
