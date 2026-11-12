// sse.mjs: read a streamed answer (server-sent events) one event at a time.
//
// With streaming on, OpenAI and Gemini send the answer in pieces, each a block like
//   data: {"type":"response.output_text.delta","delta":"Hel"}
// followed by a blank line. This yields each block's JSON as it arrives.

export async function* sseEvents(response) {
  const decoder = new TextDecoder()
  let buffer = ''
  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true })
    let match
    while ((match = /\r?\n\r?\n/.exec(buffer))) {
      const block = buffer.slice(0, match.index)
      buffer = buffer.slice(match.index + match[0].length)
      const data = block.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n')
      if (data && data !== '[DONE]') yield JSON.parse(data)
    }
  }
}
