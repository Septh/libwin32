import MagicString from 'magic-string'
import type { Plugin } from 'rollup'

export function uncomment(): Plugin {

    return {
        name: 'libwin32-scrape-comments',

        renderChunk(code) {
            const scraper = new MagicStringEx(code)
            scraper.removeComments(comment => !comment.startsWith('/*!'))
            return scraper.hasChanged()
                ? { code: scraper.toString(), map: scraper.generateMap() }
                : null
        }
    }
}

class MagicStringEx extends MagicString {

    public removeComments(shouldRemove: (comment: string) => boolean): MagicStringEx {
        const self = this,
              { original: code } = self,
              eof = code.length
        return scan(0, false), this

        function scan(pos: number, inTemplate: boolean): number {
            let braces = 0,
                char: number,
                start: number;
            while (pos < eof) {
                switch (char = code.charCodeAt(pos)) {

                    // Handle comments.
                    case CharCode.slash:
                        start = pos
                        char = code.charCodeAt(++pos)
                        if (char === CharCode.slash) {
                            ++pos

                            // Skip the comment's body.
                            while (++pos < eof && !lineTerminators.has(code.charCodeAt(pos)));

                            // If the comment happens to be alone on its line (like this one), remove the whole line.
                            while (start > 0 && whitespace.has(code.charCodeAt(start - 1)))
                                --start
                            if (start === 0 || lineTerminators.has(code.charCodeAt(start - 1))) {
                                ++pos
                                if (code.charCodeAt(pos) === CharCode.lineFeed && code.charCodeAt(pos - 1) === CharCode.carriageReturn)
                                    ++pos
                            }

                            // Always remove line comments.
                            self.remove(start, pos)
                        }
                        else if (char === CharCode.asterisk) {
                            ++pos

                            // Get the comment's body.
                            while (++pos < eof && !(code.charCodeAt(pos) === CharCode.slash && code.charCodeAt(pos - 1) === CharCode.asterisk));
                            const comment = code.slice(start, ++pos)

                            // Remove it?
                            if (shouldRemove(comment)) {
                                /* If the comment happens to be alone on its line (like this one), remove the whole line. */
                                let after = pos
                                while (after < eof && whitespace.has(code.charCodeAt(after)))
                                    ++after
                                if (lineTerminators.has(code.charCodeAt(after))) {
                                    while (start > 0 && whitespace.has(code.charCodeAt(start - 1)))
                                        --start
                                    if (start === 0 || lineTerminators.has(code.charCodeAt(start - 1))) {
                                        ++after
                                        if (code.charCodeAt(after) === CharCode.lineFeed && code.charCodeAt(after - 1) === CharCode.carriageReturn)
                                            ++after
                                    }
                                    pos = after
                                }
                                else if (after > pos) {
                                    // Otherwise, remove whitespace following the comment.
                                    pos = after
                                }
                                else {
                                    // Otherwise, remove whitespace preceding the comment (but not indentation).
                                    let before = start
                                    while (before > 0 && whitespace.has(code.charCodeAt(before - 1)))
                                        --before
                                    if (before > 0 && !lineTerminators.has(code.charCodeAt(before - 1)))
                                        start = before
                                }

                                self.remove(start, pos)
                            }
                        }
                        break

                    // Skip strings altogether so we don't process their content inadvertently.
                    case CharCode.quotationMark:
                    case CharCode.apostrophe:
                        while (++pos < eof && (code.charCodeAt(pos) !== char || code.charCodeAt(pos - 1) === CharCode.backslash));
                        ++pos
                        break

                    // Entering a template literal.
                    // If substitution slices (anything between '${' and '}') are found,
                    // we recursively call ourselves for easy handling of their contents.
                    case CharCode.backtick:
                        pos++
                        while (pos < eof && (code.charCodeAt(pos) !== CharCode.backtick || code.charCodeAt(pos - 1) === CharCode.backslash)) {
                            if (code.charCodeAt(pos) === CharCode.dollar && code.charCodeAt(pos + 1) === CharCode.openBrace) {
                                pos = scan(pos + 1, true)
                            }
                            else ++pos
                        }
                        ++pos
                        break

                    // When scanning inside a template literal substitution slice, we track brace opening/closing
                    // so as not to mistake a closing brace for the end of that slice.
                    case CharCode.openBrace:
                        ++pos
                        if (inTemplate)
                            braces++
                        break

                    case CharCode.closeBrace:
                        ++pos
                        if (inTemplate && --braces === 0)
                            return pos
                        break

                    default:
                        ++pos
                        if (lineTerminators.has(char)) {
                            start = pos - 1
                            while (pos < eof && lineTerminators.has(code.charCodeAt(pos)))
                                ++pos
                            if (pos - start > 1) {
                                self.remove(start, pos - 1)
                            }
                        }
                        break
                }
            }
            return pos
        }
    }
}

const enum CharCode {
    EOF                   = -1,

    NUL                   = 0,
    backspace             = 0x08,
    tab                   = 0x09,
    lineFeed              = 0x0a,
    lineTab               = 0x0b,
    formFeed              = 0x0c,
    carriageReturn        = 0x0d,

    space                 = 0x20,
    exclamationMark       = 0x21,
    quotationMark         = 0x22,
    hash                  = 0x23,
    dollar                = 0x24,
    percent               = 0x25,
    ampersand             = 0x26,
    apostrophe            = 0x27,
    openParen             = 0x28,
    closeParen            = 0x29,
    asterisk              = 0x2a,
    plus                  = 0x2b,
    comma                 = 0x2c,
    minus                 = 0x2d,
    dot                   = 0x2e,
    slash                 = 0x2f,
    _0                    = 0x30,
    _1                    = 0x31,
    _2                    = 0x32,
    _3                    = 0x33,
    _4                    = 0x34,
    _5                    = 0x35,
    _6                    = 0x36,
    _7                    = 0x37,
    _8                    = 0x38,
    _9                    = 0x39,
    colon                 = 0x3a,
    semicolon             = 0x3b,
    lessThan              = 0x3c,
    equals                = 0x3d,
    greaterThan           = 0x3e,
    questionMark          = 0x3f,
    at                    = 0x40,
    A                     = 0x41,
    B                     = 0x42,
    C                     = 0x43,
    D                     = 0x44,
    E                     = 0x45,
    F                     = 0x46,
    G                     = 0x47,
    H                     = 0x48,
    I                     = 0x49,
    J                     = 0x4a,
    K                     = 0x4b,
    L                     = 0x4c,
    M                     = 0x4d,
    N                     = 0x4e,
    O                     = 0x4f,
    P                     = 0x50,
    Q                     = 0x51,
    R                     = 0x52,
    S                     = 0x53,
    T                     = 0x54,
    U                     = 0x55,
    V                     = 0x56,
    W                     = 0x57,
    X                     = 0x58,
    Y                     = 0x59,
    Z                     = 0x5a,
    openBracket           = 0x5b,
    backslash             = 0x5c,
    closeBracket          = 0x5d,
    caret                 = 0x5e,
    underscore            = 0x5f,
    backtick              = 0x60,
    a                     = 0x61,
    b                     = 0x62,
    c                     = 0x63,
    d                     = 0x64,
    e                     = 0x65,
    f                     = 0x66,
    g                     = 0x67,
    h                     = 0x68,
    i                     = 0x69,
    j                     = 0x6a,
    k                     = 0x6b,
    l                     = 0x6c,
    m                     = 0x6d,
    n                     = 0x6e,
    o                     = 0x6f,
    p                     = 0x70,
    q                     = 0x71,
    r                     = 0x72,
    s                     = 0x73,
    t                     = 0x74,
    u                     = 0x75,
    v                     = 0x76,
    w                     = 0x77,
    x                     = 0x78,
    y                     = 0x79,
    z                     = 0x7a,
    openBrace             = 0x7b,
    bar                   = 0x7c,
    closeBrace            = 0x7d,
    tilde                 = 0x7e,
    MAX_ASCII_CHARACTER   = 0x7f,

    noBreakSpace          = 0x00a0,
    enQuad                = 0x2000,
    emQuad                = 0x2001,
    enSpace               = 0x2002,
    emSpace               = 0x2003,
    threePerEmSpace       = 0x2004,
    fourPerEmSpace        = 0x2005,
    sixPerEmSpace         = 0x2006,
    figureSpace           = 0x2007,
    punctuationSpace      = 0x2008,
    thinSpace             = 0x2009,
    hairSpace             = 0x200a,
    zeroWidthSpace        = 0x200b,
    zeroWidthNonJoiner    = 0x200c,
    zeroWidthJoiner       = 0x200d,
    lineSeparator         = 0x2028,
    paragraphSeparator    = 0x2029,
    narrowNoBreakSpace    = 0x202f,
    mathematicalSpace     = 0x205f,
    ideographicSpace      = 0x3000,
    oghamSpaceMark        = 0x1680,
    zeroWidthNoBreakSpace = 0xfeff,
    byteOrderMark         = zeroWidthNoBreakSpace,
    replacementCharacter  = 0xfffd,
    MAX_UTF16_CHARACTER   = 0xffff,
}

const lineTerminators = new Set([
    CharCode.lineFeed,
    CharCode.carriageReturn,
    CharCode.lineSeparator,
    CharCode.paragraphSeparator,
])

const whitespace = new Set([
    CharCode.tab,
    CharCode.lineTab,
    CharCode.formFeed,
    CharCode.space,
    CharCode.noBreakSpace,
    CharCode.oghamSpaceMark,
    CharCode.enQuad,
    CharCode.emQuad,
    CharCode.enSpace,
    CharCode.emSpace,
    CharCode.threePerEmSpace,
    CharCode.fourPerEmSpace,
    CharCode.sixPerEmSpace,
    CharCode.figureSpace,
    CharCode.punctuationSpace,
    CharCode.thinSpace,
    CharCode.hairSpace,
    CharCode.zeroWidthSpace,
    CharCode.narrowNoBreakSpace,
    CharCode.mathematicalSpace,
    CharCode.ideographicSpace,
])
