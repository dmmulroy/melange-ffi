// Generated by Melange

import * as Caml_bytes from "../melange.js/caml_bytes.mjs";
import * as Caml_js_exceptions from "../melange.js/caml_js_exceptions.mjs";
import * as Curry from "../melange.js/curry.mjs";
import * as Stdlib from "./stdlib.mjs";
import * as Stdlib__Char from "./char.mjs";
import * as Stdlib__Int from "./int.mjs";
import * as Stdlib__Seq from "./seq.mjs";
import * as Stdlib__Sys from "./sys.mjs";

function make(n, c) {
  var s = Caml_bytes.caml_create_bytes(n);
  Caml_bytes.caml_fill_bytes(s, 0, n, c);
  return s;
}

function init(n, f) {
  var s = Caml_bytes.caml_create_bytes(n);
  for(var i = 0; i < n; ++i){
    s[i] = Curry._1(f, i);
  }
  return s;
}

var empty = [];

function copy(s) {
  var len = s.length;
  var r = Caml_bytes.caml_create_bytes(len);
  Caml_bytes.caml_blit_bytes(s, 0, r, 0, len);
  return r;
}

function to_string(b) {
  return Caml_bytes.bytes_to_string(copy(b));
}

function of_string(s) {
  return copy(Caml_bytes.bytes_of_string(s));
}

function sub(s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.sub / Bytes.sub",
          Error: new Error()
        };
  }
  var r = Caml_bytes.caml_create_bytes(len);
  Caml_bytes.caml_blit_bytes(s, ofs, r, 0, len);
  return r;
}

function sub_string(b, ofs, len) {
  return Caml_bytes.bytes_to_string(sub(b, ofs, len));
}

function $plus$plus(a, b) {
  var c = a + b | 0;
  var match = a < 0;
  var match$1 = b < 0;
  var match$2 = c < 0;
  if (match) {
    if (!match$1) {
      return c;
    }
    if (match$2) {
      return c;
    }
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Bytes.extend",
          Error: new Error()
        };
  }
  if (match$1) {
    return c;
  }
  if (match$2) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Bytes.extend",
          Error: new Error()
        };
  }
  return c;
}

function extend(s, left, right) {
  var len = $plus$plus($plus$plus(s.length, left), right);
  var r = Caml_bytes.caml_create_bytes(len);
  var match = left < 0 ? [
      -left | 0,
      0
    ] : [
      0,
      left
    ];
  var dstoff = match[1];
  var srcoff = match[0];
  var cpylen = Stdlib__Int.min(s.length - srcoff | 0, len - dstoff | 0);
  if (cpylen > 0) {
    Caml_bytes.caml_blit_bytes(s, srcoff, r, dstoff, cpylen);
  }
  return r;
}

function fill(s, ofs, len, c) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.fill / Bytes.fill",
          Error: new Error()
        };
  }
  Caml_bytes.caml_fill_bytes(s, ofs, len, c);
}

function blit(s1, ofs1, s2, ofs2, len) {
  if (len < 0 || ofs1 < 0 || ofs1 > (s1.length - len | 0) || ofs2 < 0 || ofs2 > (s2.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "Bytes.blit",
          Error: new Error()
        };
  }
  Caml_bytes.caml_blit_bytes(s1, ofs1, s2, ofs2, len);
}

function blit_string(s1, ofs1, s2, ofs2, len) {
  if (len < 0 || ofs1 < 0 || ofs1 > (s1.length - len | 0) || ofs2 < 0 || ofs2 > (s2.length - len | 0)) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.blit / Bytes.blit_string",
          Error: new Error()
        };
  }
  Caml_bytes.caml_blit_string(s1, ofs1, s2, ofs2, len);
}

function iter(f, a) {
  for(var i = 0 ,i_finish = a.length; i < i_finish; ++i){
    Curry._1(f, a[i]);
  }
}

function iteri(f, a) {
  for(var i = 0 ,i_finish = a.length; i < i_finish; ++i){
    Curry._2(f, i, a[i]);
  }
}

function ensure_ge(x, y) {
  if (x >= y) {
    return x;
  }
  throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "Bytes.concat",
        Error: new Error()
      };
}

function sum_lengths(_acc, seplen, _param) {
  while(true) {
    var param = _param;
    var acc = _acc;
    if (!param) {
      return acc;
    }
    var hd = param.hd;
    if (!param.tl) {
      return hd.length + acc | 0;
    }
    _param = param.tl;
    _acc = ensure_ge((hd.length + seplen | 0) + acc | 0, acc);
    continue ;
  };
}

function concat(sep, l) {
  if (!l) {
    return empty;
  }
  var seplen = sep.length;
  var dst = Caml_bytes.caml_create_bytes(sum_lengths(0, seplen, l));
  var _pos = 0;
  var _param = l;
  while(true) {
    var param = _param;
    var pos = _pos;
    if (!param) {
      return dst;
    }
    var hd = param.hd;
    if (param.tl) {
      Caml_bytes.caml_blit_bytes(hd, 0, dst, pos, hd.length);
      Caml_bytes.caml_blit_bytes(sep, 0, dst, pos + hd.length | 0, seplen);
      _param = param.tl;
      _pos = (pos + hd.length | 0) + seplen | 0;
      continue ;
    }
    Caml_bytes.caml_blit_bytes(hd, 0, dst, pos, hd.length);
    return dst;
  };
}

function cat(s1, s2) {
  var l1 = s1.length;
  var l2 = s2.length;
  var r = Caml_bytes.caml_create_bytes(l1 + l2 | 0);
  Caml_bytes.caml_blit_bytes(s1, 0, r, 0, l1);
  Caml_bytes.caml_blit_bytes(s2, 0, r, l1, l2);
  return r;
}

function is_space(param) {
  if (param > 13 || param < 9) {
    return param === 32;
  } else {
    return param !== 11;
  }
}

function trim(s) {
  var len = s.length;
  var i = 0;
  while(i < len && is_space(s[i])) {
    i = i + 1 | 0;
  };
  var j = len - 1 | 0;
  while(j >= i && is_space(s[j])) {
    j = j - 1 | 0;
  };
  if (j >= i) {
    return sub(s, i, (j - i | 0) + 1 | 0);
  } else {
    return empty;
  }
}

function unsafe_escape(s) {
  var n = 0;
  for(var i = 0 ,i_finish = s.length; i < i_finish; ++i){
    var match = s[i];
    n = n + (
      match >= 32 ? (
          match > 92 || match < 34 ? (
              match >= 127 ? 4 : 1
            ) : (
              match > 91 || match < 35 ? 2 : 1
            )
        ) : (
          match >= 11 ? (
              match !== 13 ? 4 : 2
            ) : (
              match >= 8 ? 2 : 4
            )
        )
    ) | 0;
  }
  if (n === s.length) {
    return s;
  }
  var s$p = Caml_bytes.caml_create_bytes(n);
  n = 0;
  for(var i$1 = 0 ,i_finish$1 = s.length; i$1 < i_finish$1; ++i$1){
    var c = s[i$1];
    var exit = 0;
    if (c >= 35) {
      if (c !== 92) {
        if (c >= 127) {
          exit = 1;
        } else {
          s$p[n] = c;
        }
      } else {
        exit = 2;
      }
    } else if (c >= 32) {
      if (c >= 34) {
        exit = 2;
      } else {
        s$p[n] = c;
      }
    } else if (c >= 14) {
      exit = 1;
    } else {
      switch (c) {
        case 8 :
            s$p[n] = /* '\\' */92;
            n = n + 1 | 0;
            s$p[n] = /* 'b' */98;
            break;
        case 9 :
            s$p[n] = /* '\\' */92;
            n = n + 1 | 0;
            s$p[n] = /* 't' */116;
            break;
        case 10 :
            s$p[n] = /* '\\' */92;
            n = n + 1 | 0;
            s$p[n] = /* 'n' */110;
            break;
        case 0 :
        case 1 :
        case 2 :
        case 3 :
        case 4 :
        case 5 :
        case 6 :
        case 7 :
        case 11 :
        case 12 :
            exit = 1;
            break;
        case 13 :
            s$p[n] = /* '\\' */92;
            n = n + 1 | 0;
            s$p[n] = /* 'r' */114;
            break;
        
      }
    }
    switch (exit) {
      case 1 :
          s$p[n] = /* '\\' */92;
          n = n + 1 | 0;
          s$p[n] = 48 + (c / 100 | 0) | 0;
          n = n + 1 | 0;
          s$p[n] = 48 + (c / 10 | 0) % 10 | 0;
          n = n + 1 | 0;
          s$p[n] = 48 + c % 10 | 0;
          break;
      case 2 :
          s$p[n] = /* '\\' */92;
          n = n + 1 | 0;
          s$p[n] = c;
          break;
      
    }
    n = n + 1 | 0;
  }
  return s$p;
}

function escaped(b) {
  return unsafe_escape(copy(b));
}

function map(f, s) {
  var l = s.length;
  if (l === 0) {
    return s;
  }
  var r = Caml_bytes.caml_create_bytes(l);
  for(var i = 0; i < l; ++i){
    r[i] = Curry._1(f, s[i]);
  }
  return r;
}

function mapi(f, s) {
  var l = s.length;
  if (l === 0) {
    return s;
  }
  var r = Caml_bytes.caml_create_bytes(l);
  for(var i = 0; i < l; ++i){
    r[i] = Curry._2(f, i, s[i]);
  }
  return r;
}

function fold_left(f, x, a) {
  var r = x;
  for(var i = 0 ,i_finish = a.length; i < i_finish; ++i){
    r = Curry._2(f, r, a[i]);
  }
  return r;
}

function fold_right(f, a, x) {
  var r = x;
  for(var i = a.length - 1 | 0; i >= 0; --i){
    r = Curry._2(f, a[i], r);
  }
  return r;
}

function exists(p, s) {
  var n = s.length;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i === n) {
      return false;
    }
    if (Curry._1(p, s[i])) {
      return true;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function for_all(p, s) {
  var n = s.length;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i === n) {
      return true;
    }
    if (!Curry._1(p, s[i])) {
      return false;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function uppercase_ascii(s) {
  return map(Stdlib__Char.uppercase_ascii, s);
}

function lowercase_ascii(s) {
  return map(Stdlib__Char.lowercase_ascii, s);
}

function apply1(f, s) {
  if (s.length === 0) {
    return s;
  }
  var r = copy(s);
  r[0] = Curry._1(f, s[0]);
  return r;
}

function capitalize_ascii(s) {
  return apply1(Stdlib__Char.uppercase_ascii, s);
}

function uncapitalize_ascii(s) {
  return apply1(Stdlib__Char.lowercase_ascii, s);
}

function starts_with(prefix, s) {
  var len_s = s.length;
  var len_pre = prefix.length;
  if (len_s >= len_pre) {
    var _i = 0;
    while(true) {
      var i = _i;
      if (i === len_pre) {
        return true;
      }
      if (s[i] !== prefix[i]) {
        return false;
      }
      _i = i + 1 | 0;
      continue ;
    };
  } else {
    return false;
  }
}

function ends_with(suffix, s) {
  var len_s = s.length;
  var len_suf = suffix.length;
  var diff = len_s - len_suf | 0;
  if (diff >= 0) {
    var _i = 0;
    while(true) {
      var i = _i;
      if (i === len_suf) {
        return true;
      }
      if (s[diff + i | 0] !== suffix[i]) {
        return false;
      }
      _i = i + 1 | 0;
      continue ;
    };
  } else {
    return false;
  }
}

function index_rec(s, lim, _i, c) {
  while(true) {
    var i = _i;
    if (i >= lim) {
      throw {
            RE_EXN_ID: Stdlib.Not_found,
            Error: new Error()
          };
    }
    if (s[i] === c) {
      return i;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function index(s, c) {
  return index_rec(s, s.length, 0, c);
}

function index_rec_opt(s, lim, _i, c) {
  while(true) {
    var i = _i;
    if (i >= lim) {
      return ;
    }
    if (s[i] === c) {
      return i;
    }
    _i = i + 1 | 0;
    continue ;
  };
}

function index_opt(s, c) {
  return index_rec_opt(s, s.length, 0, c);
}

function index_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.index_from / Bytes.index_from",
          Error: new Error()
        };
  }
  return index_rec(s, l, i, c);
}

function index_from_opt(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.index_from_opt / Bytes.index_from_opt",
          Error: new Error()
        };
  }
  return index_rec_opt(s, l, i, c);
}

function rindex_rec(s, _i, c) {
  while(true) {
    var i = _i;
    if (i < 0) {
      throw {
            RE_EXN_ID: Stdlib.Not_found,
            Error: new Error()
          };
    }
    if (s[i] === c) {
      return i;
    }
    _i = i - 1 | 0;
    continue ;
  };
}

function rindex(s, c) {
  return rindex_rec(s, s.length - 1 | 0, c);
}

function rindex_from(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.rindex_from / Bytes.rindex_from",
          Error: new Error()
        };
  }
  return rindex_rec(s, i, c);
}

function rindex_rec_opt(s, _i, c) {
  while(true) {
    var i = _i;
    if (i < 0) {
      return ;
    }
    if (s[i] === c) {
      return i;
    }
    _i = i - 1 | 0;
    continue ;
  };
}

function rindex_opt(s, c) {
  return rindex_rec_opt(s, s.length - 1 | 0, c);
}

function rindex_from_opt(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.rindex_from_opt / Bytes.rindex_from_opt",
          Error: new Error()
        };
  }
  return rindex_rec_opt(s, i, c);
}

function contains_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.contains_from / Bytes.contains_from",
          Error: new Error()
        };
  }
  try {
    index_rec(s, l, i, c);
    return true;
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === Stdlib.Not_found) {
      return false;
    }
    throw exn;
  }
}

function contains(s, c) {
  return contains_from(s, 0, c);
}

function rcontains_from(s, i, c) {
  if (i < 0 || i >= s.length) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "String.rcontains_from / Bytes.rcontains_from",
          Error: new Error()
        };
  }
  try {
    rindex_rec(s, i, c);
    return true;
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === Stdlib.Not_found) {
      return false;
    }
    throw exn;
  }
}

var compare = Caml_bytes.caml_bytes_compare;

function split_on_char(sep, s) {
  var r = /* [] */0;
  var j = s.length;
  for(var i = s.length - 1 | 0; i >= 0; --i){
    if (s[i] === sep) {
      r = {
        hd: sub(s, i + 1 | 0, (j - i | 0) - 1 | 0),
        tl: r
      };
      j = i;
    }
    
  }
  return {
          hd: sub(s, 0, j),
          tl: r
        };
}

function to_seq(s) {
  var aux = function (i, param) {
    if (i === s.length) {
      return /* Nil */0;
    }
    var x = Caml_bytes.get(s, i);
    var partial_arg = i + 1 | 0;
    return /* Cons */{
            _0: x,
            _1: (function (param) {
                return aux(partial_arg, param);
              })
          };
  };
  return function (param) {
    return aux(0, param);
  };
}

function to_seqi(s) {
  var aux = function (i, param) {
    if (i === s.length) {
      return /* Nil */0;
    }
    var x = Caml_bytes.get(s, i);
    var partial_arg = i + 1 | 0;
    return /* Cons */{
            _0: [
              i,
              x
            ],
            _1: (function (param) {
                return aux(partial_arg, param);
              })
          };
  };
  return function (param) {
    return aux(0, param);
  };
}

function of_seq(i) {
  var n = {
    contents: 0
  };
  var buf = {
    contents: make(256, /* '\000' */0)
  };
  var resize = function (param) {
    var new_len = Stdlib__Int.min((buf.contents.length << 1), Stdlib__Sys.max_string_length);
    if (buf.contents.length === new_len) {
      throw {
            RE_EXN_ID: "Failure",
            _1: "Bytes.of_seq: cannot grow bytes",
            Error: new Error()
          };
    }
    var new_buf = make(new_len, /* '\000' */0);
    blit(buf.contents, 0, new_buf, 0, n.contents);
    buf.contents = new_buf;
  };
  Stdlib__Seq.iter((function (c) {
          if (n.contents === buf.contents.length) {
            resize(undefined);
          }
          Caml_bytes.set(buf.contents, n.contents, c);
          n.contents = n.contents + 1 | 0;
        }), i);
  return sub(buf.contents, 0, n.contents);
}

function unsafe_get_uint16_le(b, i) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.bswap16(Caml_bytes.get16u(b, i));
  } else {
    return Caml_bytes.get16u(b, i);
  }
}

function unsafe_get_uint16_be(b, i) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.get16u(b, i);
  } else {
    return Caml_bytes.bswap16(Caml_bytes.get16u(b, i));
  }
}

function get_int8(b, i) {
  return ((Caml_bytes.get(b, i) << (Stdlib__Sys.int_size - 8 | 0)) >> (Stdlib__Sys.int_size - 8 | 0));
}

function get_uint16_le(b, i) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.bswap16(Caml_bytes.get16(b, i));
  } else {
    return Caml_bytes.get16(b, i);
  }
}

function get_uint16_be(b, i) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.get16(b, i);
  } else {
    return Caml_bytes.bswap16(Caml_bytes.get16(b, i));
  }
}

function get_int16_ne(b, i) {
  return ((Caml_bytes.get16(b, i) << (Stdlib__Sys.int_size - 16 | 0)) >> (Stdlib__Sys.int_size - 16 | 0));
}

function get_int16_le(b, i) {
  return ((get_uint16_le(b, i) << (Stdlib__Sys.int_size - 16 | 0)) >> (Stdlib__Sys.int_size - 16 | 0));
}

function get_int16_be(b, i) {
  return ((get_uint16_be(b, i) << (Stdlib__Sys.int_size - 16 | 0)) >> (Stdlib__Sys.int_size - 16 | 0));
}

function get_int32_le(b, i) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.bswap32(Caml_bytes.get32(b, i));
  } else {
    return Caml_bytes.get32(b, i);
  }
}

function get_int32_be(b, i) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.get32(b, i);
  } else {
    return Caml_bytes.bswap32(Caml_bytes.get32(b, i));
  }
}

function get_int64_le(b, i) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.bswap64(Caml_bytes.get64(b, i));
  } else {
    return Caml_bytes.get64(b, i);
  }
}

function get_int64_be(b, i) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.get64(b, i);
  } else {
    return Caml_bytes.bswap64(Caml_bytes.get64(b, i));
  }
}

function unsafe_set_uint16_le(b, i, x) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.set16u(b, i, Caml_bytes.bswap16(x));
  } else {
    return Caml_bytes.set16u(b, i, x);
  }
}

function unsafe_set_uint16_be(b, i, x) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.set16u(b, i, x);
  } else {
    return Caml_bytes.set16u(b, i, Caml_bytes.bswap16(x));
  }
}

function set_int16_le(b, i, x) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.set16(b, i, Caml_bytes.bswap16(x));
  } else {
    return Caml_bytes.set16(b, i, x);
  }
}

function set_int16_be(b, i, x) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.set16(b, i, x);
  } else {
    return Caml_bytes.set16(b, i, Caml_bytes.bswap16(x));
  }
}

function set_int32_le(b, i, x) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.set32(b, i, Caml_bytes.bswap32(x));
  } else {
    return Caml_bytes.set32(b, i, x);
  }
}

function set_int32_be(b, i, x) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.set32(b, i, x);
  } else {
    return Caml_bytes.set32(b, i, Caml_bytes.bswap32(x));
  }
}

function set_int64_le(b, i, x) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.set64(b, i, Caml_bytes.bswap64(x));
  } else {
    return Caml_bytes.set64(b, i, x);
  }
}

function set_int64_be(b, i, x) {
  if (Stdlib__Sys.big_endian) {
    return Caml_bytes.set64(b, i, x);
  } else {
    return Caml_bytes.set64(b, i, Caml_bytes.bswap64(x));
  }
}

var set_uint8 = Caml_bytes.set;

var set_uint16_ne = Caml_bytes.set16;

function get_utf_8_uchar(b, i) {
  var b0 = Caml_bytes.get(b, i);
  var max = b.length - 1 | 0;
  var exit = 0;
  if (b0 >= 224) {
    if (b0 >= 237) {
      if (b0 >= 245) {
        return 16842749;
      }
      switch (b0) {
        case 237 :
            var i$1 = i + 1 | 0;
            if (i$1 > max) {
              return 16842749;
            }
            var b1 = b[i$1];
            if ((b1 >>> 5) !== 4) {
              return 16842749;
            }
            var i$2 = i$1 + 1 | 0;
            if (i$2 > max) {
              return 33619965;
            }
            var b2 = b[i$2];
            if ((b2 >>> 6) !== 2) {
              return 33619965;
            }
            var u = ((b0 & 15) << 12) | ((b1 & 63) << 6) | b2 & 63;
            return 184549376 | u;
        case 238 :
        case 239 :
            exit = 1;
            break;
        case 240 :
            var i$3 = i + 1 | 0;
            if (i$3 > max) {
              return 16842749;
            }
            var b1$1 = b[i$3];
            if (b1$1 < 144 || 191 < b1$1) {
              return 16842749;
            }
            var i$4 = i$3 + 1 | 0;
            if (i$4 > max) {
              return 33619965;
            }
            var b2$1 = b[i$4];
            if ((b2$1 >>> 6) !== 2) {
              return 33619965;
            }
            var i$5 = i$4 + 1 | 0;
            if (i$5 > max) {
              return 50397181;
            }
            var b3 = b[i$5];
            if ((b3 >>> 6) !== 2) {
              return 50397181;
            }
            var u$1 = ((b0 & 7) << 18) | ((b1$1 & 63) << 12) | ((b2$1 & 63) << 6) | b3 & 63;
            return 201326592 | u$1;
        case 241 :
        case 242 :
        case 243 :
            exit = 2;
            break;
        case 244 :
            var i$6 = i + 1 | 0;
            if (i$6 > max) {
              return 16842749;
            }
            var b1$2 = b[i$6];
            if ((b1$2 >>> 4) !== 8) {
              return 16842749;
            }
            var i$7 = i$6 + 1 | 0;
            if (i$7 > max) {
              return 33619965;
            }
            var b2$2 = b[i$7];
            if ((b2$2 >>> 6) !== 2) {
              return 33619965;
            }
            var i$8 = i$7 + 1 | 0;
            if (i$8 > max) {
              return 50397181;
            }
            var b3$1 = b[i$8];
            if ((b3$1 >>> 6) !== 2) {
              return 50397181;
            }
            var u$2 = ((b0 & 7) << 18) | ((b1$2 & 63) << 12) | ((b2$2 & 63) << 6) | b3$1 & 63;
            return 201326592 | u$2;
        
      }
    } else if (b0 >= 225) {
      exit = 1;
    } else {
      var i$9 = i + 1 | 0;
      if (i$9 > max) {
        return 16842749;
      }
      var b1$3 = b[i$9];
      if ((b1$3 >>> 5) !== 5) {
        return 16842749;
      }
      var i$10 = i$9 + 1 | 0;
      if (i$10 > max) {
        return 33619965;
      }
      var b2$3 = b[i$10];
      if ((b2$3 >>> 6) !== 2) {
        return 33619965;
      }
      var u$3 = ((b0 & 15) << 12) | ((b1$3 & 63) << 6) | b2$3 & 63;
      return 184549376 | u$3;
    }
  } else {
    if (b0 < 128) {
      return 150994944 | b0;
    }
    if (b0 < 194) {
      return 16842749;
    }
    var i$11 = i + 1 | 0;
    if (i$11 > max) {
      return 16842749;
    }
    var b1$4 = b[i$11];
    if ((b1$4 >>> 6) !== 2) {
      return 16842749;
    }
    var u$4 = ((b0 & 31) << 6) | b1$4 & 63;
    return 167772160 | u$4;
  }
  switch (exit) {
    case 1 :
        var i$12 = i + 1 | 0;
        if (i$12 > max) {
          return 16842749;
        }
        var b1$5 = b[i$12];
        if ((b1$5 >>> 6) !== 2) {
          return 16842749;
        }
        var i$13 = i$12 + 1 | 0;
        if (i$13 > max) {
          return 33619965;
        }
        var b2$4 = b[i$13];
        if ((b2$4 >>> 6) !== 2) {
          return 33619965;
        }
        var u$5 = ((b0 & 15) << 12) | ((b1$5 & 63) << 6) | b2$4 & 63;
        return 184549376 | u$5;
    case 2 :
        var i$14 = i + 1 | 0;
        if (i$14 > max) {
          return 16842749;
        }
        var b1$6 = b[i$14];
        if ((b1$6 >>> 6) !== 2) {
          return 16842749;
        }
        var i$15 = i$14 + 1 | 0;
        if (i$15 > max) {
          return 33619965;
        }
        var b2$5 = b[i$15];
        if ((b2$5 >>> 6) !== 2) {
          return 33619965;
        }
        var i$16 = i$15 + 1 | 0;
        if (i$16 > max) {
          return 50397181;
        }
        var b3$2 = b[i$16];
        if ((b3$2 >>> 6) !== 2) {
          return 50397181;
        }
        var u$6 = ((b0 & 7) << 18) | ((b1$6 & 63) << 12) | ((b2$5 & 63) << 6) | b3$2 & 63;
        return 201326592 | u$6;
    
  }
}

function set_utf_8_uchar(b, i, u) {
  var max = b.length - 1 | 0;
  var u$1 = u;
  if (u$1 < 0) {
    throw {
          RE_EXN_ID: "Assert_failure",
          _1: [
            "bytes.cppo.ml",
            654,
            20
          ],
          Error: new Error()
        };
  }
  if (u$1 <= 127) {
    Caml_bytes.set(b, i, u$1);
    return 1;
  }
  if (u$1 <= 2047) {
    var last = i + 1 | 0;
    if (last > max) {
      return 0;
    } else {
      Caml_bytes.set(b, i, 192 | (u$1 >>> 6));
      b[last] = 128 | u$1 & 63;
      return 2;
    }
  }
  if (u$1 <= 65535) {
    var last$1 = i + 2 | 0;
    if (last$1 > max) {
      return 0;
    } else {
      Caml_bytes.set(b, i, 224 | (u$1 >>> 12));
      b[i + 1 | 0] = 128 | (u$1 >>> 6) & 63;
      b[last$1] = 128 | u$1 & 63;
      return 3;
    }
  }
  if (u$1 <= 1114111) {
    var last$2 = i + 3 | 0;
    if (last$2 > max) {
      return 0;
    } else {
      Caml_bytes.set(b, i, 240 | (u$1 >>> 18));
      b[i + 1 | 0] = 128 | (u$1 >>> 12) & 63;
      b[i + 2 | 0] = 128 | (u$1 >>> 6) & 63;
      b[last$2] = 128 | u$1 & 63;
      return 4;
    }
  }
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "bytes.cppo.ml",
          679,
          9
        ],
        Error: new Error()
      };
}

function is_valid_utf_8(b) {
  var max = b.length - 1 | 0;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i > max) {
      return true;
    }
    var match = b[i];
    var exit = 0;
    if (match >= 224) {
      if (match >= 237) {
        if (match >= 245) {
          return false;
        }
        switch (match) {
          case 237 :
              var last = i + 2 | 0;
              if (last > max || (b[i + 1 | 0] >>> 5) !== 4 || (b[last] >>> 6) !== 2) {
                return false;
              }
              _i = last + 1 | 0;
              continue ;
          case 238 :
          case 239 :
              exit = 1;
              break;
          case 240 :
              var last$1 = i + 3 | 0;
              var tmp = true;
              if (last$1 <= max) {
                var b$1 = b[i + 1 | 0];
                tmp = b$1 < 144 || 191 < b$1 || (b[i + 2 | 0] >>> 6) !== 2 || (b[last$1] >>> 6) !== 2;
              }
              if (tmp) {
                return false;
              }
              _i = last$1 + 1 | 0;
              continue ;
          case 241 :
          case 242 :
          case 243 :
              exit = 2;
              break;
          case 244 :
              var last$2 = i + 3 | 0;
              if (last$2 > max || (b[i + 1 | 0] >>> 4) !== 8 || (b[i + 2 | 0] >>> 6) !== 2 || (b[last$2] >>> 6) !== 2) {
                return false;
              }
              _i = last$2 + 1 | 0;
              continue ;
          
        }
      } else if (match >= 225) {
        exit = 1;
      } else {
        var last$3 = i + 2 | 0;
        if (last$3 > max || (b[i + 1 | 0] >>> 5) !== 5 || (b[last$3] >>> 6) !== 2) {
          return false;
        }
        _i = last$3 + 1 | 0;
        continue ;
      }
    } else {
      if (match >= 128) {
        if (match < 194) {
          return false;
        }
        var last$4 = i + 1 | 0;
        if (last$4 > max || (b[last$4] >>> 6) !== 2) {
          return false;
        }
        _i = last$4 + 1 | 0;
        continue ;
      }
      _i = i + 1 | 0;
      continue ;
    }
    switch (exit) {
      case 1 :
          var last$5 = i + 2 | 0;
          if (last$5 > max || (b[i + 1 | 0] >>> 6) !== 2 || (b[last$5] >>> 6) !== 2) {
            return false;
          }
          _i = last$5 + 1 | 0;
          continue ;
      case 2 :
          var last$6 = i + 3 | 0;
          if (last$6 > max || (b[i + 1 | 0] >>> 6) !== 2 || (b[i + 2 | 0] >>> 6) !== 2 || (b[last$6] >>> 6) !== 2) {
            return false;
          }
          _i = last$6 + 1 | 0;
          continue ;
      
    }
  };
}

function get_utf_16be_uchar(b, i) {
  var max = b.length - 1 | 0;
  if (i < 0 || i > max) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "index out of bounds",
          Error: new Error()
        };
  }
  if (i === max) {
    return 16842749;
  }
  var u = unsafe_get_uint16_be(b, i);
  if (u < 55296 || u > 57343) {
    return 167772160 | u;
  }
  if (u > 56319) {
    return 33619965;
  }
  var last = i + 3 | 0;
  if (last > max) {
    return (((max - i | 0) + 1 | 0) << 24) | 65533;
  }
  var u$1 = unsafe_get_uint16_be(b, i + 2 | 0);
  if (u$1 < 56320 || u$1 > 57343) {
    return 33619965;
  }
  var u$2 = (((u & 1023) << 10) | u$1 & 1023) + 65536 | 0;
  return 201326592 | u$2;
}

function set_utf_16be_uchar(b, i, u) {
  var max = b.length - 1 | 0;
  if (i < 0 || i > max) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "index out of bounds",
          Error: new Error()
        };
  }
  var u$1 = u;
  if (u$1 < 0) {
    throw {
          RE_EXN_ID: "Assert_failure",
          _1: [
            "bytes.cppo.ml",
            766,
            20
          ],
          Error: new Error()
        };
  }
  if (u$1 <= 65535) {
    var last = i + 1 | 0;
    if (last > max) {
      return 0;
    } else {
      unsafe_set_uint16_be(b, i, u$1);
      return 2;
    }
  }
  if (u$1 <= 1114111) {
    var last$1 = i + 3 | 0;
    if (last$1 > max) {
      return 0;
    }
    var u$p = u$1 - 65536 | 0;
    var hi = 55296 | (u$p >>> 10);
    var lo = 56320 | u$p & 1023;
    unsafe_set_uint16_be(b, i, hi);
    unsafe_set_uint16_be(b, i + 2 | 0, lo);
    return 4;
  }
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "bytes.cppo.ml",
          777,
          9
        ],
        Error: new Error()
      };
}

function is_valid_utf_16be(b) {
  var max = b.length - 1 | 0;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i > max) {
      return true;
    }
    if (i === max) {
      return false;
    }
    var u = unsafe_get_uint16_be(b, i);
    if (u < 55296 || u > 57343) {
      _i = i + 2 | 0;
      continue ;
    }
    if (u > 56319) {
      return false;
    }
    var last = i + 3 | 0;
    if (last > max) {
      return false;
    }
    var u$1 = unsafe_get_uint16_be(b, i + 2 | 0);
    if (u$1 < 56320 || u$1 > 57343) {
      return false;
    }
    _i = i + 4 | 0;
    continue ;
  };
}

function get_utf_16le_uchar(b, i) {
  var max = b.length - 1 | 0;
  if (i < 0 || i > max) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "index out of bounds",
          Error: new Error()
        };
  }
  if (i === max) {
    return 16842749;
  }
  var u = unsafe_get_uint16_le(b, i);
  if (u < 55296 || u > 57343) {
    return 167772160 | u;
  }
  if (u > 56319) {
    return 33619965;
  }
  var last = i + 3 | 0;
  if (last > max) {
    return (((max - i | 0) + 1 | 0) << 24) | 65533;
  }
  var u$1 = unsafe_get_uint16_le(b, i + 2 | 0);
  if (u$1 < 56320 || u$1 > 57343) {
    return 33619965;
  }
  var u$2 = (((u & 1023) << 10) | u$1 & 1023) + 65536 | 0;
  return 201326592 | u$2;
}

function set_utf_16le_uchar(b, i, u) {
  var max = b.length - 1 | 0;
  if (i < 0 || i > max) {
    throw {
          RE_EXN_ID: "Invalid_argument",
          _1: "index out of bounds",
          Error: new Error()
        };
  }
  var u$1 = u;
  if (u$1 < 0) {
    throw {
          RE_EXN_ID: "Assert_failure",
          _1: [
            "bytes.cppo.ml",
            820,
            20
          ],
          Error: new Error()
        };
  }
  if (u$1 <= 65535) {
    var last = i + 1 | 0;
    if (last > max) {
      return 0;
    } else {
      unsafe_set_uint16_le(b, i, u$1);
      return 2;
    }
  }
  if (u$1 <= 1114111) {
    var last$1 = i + 3 | 0;
    if (last$1 > max) {
      return 0;
    }
    var u$p = u$1 - 65536 | 0;
    var hi = 55296 | (u$p >>> 10);
    var lo = 56320 | u$p & 1023;
    unsafe_set_uint16_le(b, i, hi);
    unsafe_set_uint16_le(b, i + 2 | 0, lo);
    return 4;
  }
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "bytes.cppo.ml",
          831,
          9
        ],
        Error: new Error()
      };
}

function is_valid_utf_16le(b) {
  var max = b.length - 1 | 0;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i > max) {
      return true;
    }
    if (i === max) {
      return false;
    }
    var u = unsafe_get_uint16_le(b, i);
    if (u < 55296 || u > 57343) {
      _i = i + 2 | 0;
      continue ;
    }
    if (u > 56319) {
      return false;
    }
    var last = i + 3 | 0;
    if (last > max) {
      return false;
    }
    var u$1 = unsafe_get_uint16_le(b, i + 2 | 0);
    if (u$1 < 56320 || u$1 > 57343) {
      return false;
    }
    _i = i + 4 | 0;
    continue ;
  };
}

var equal = Caml_bytes.caml_bytes_equal;

var unsafe_to_string = Caml_bytes.bytes_to_string;

var unsafe_of_string = Caml_bytes.bytes_of_string;

var get_uint8 = Caml_bytes.get;

var get_uint16_ne = Caml_bytes.get16;

var get_int32_ne = Caml_bytes.get32;

var get_int64_ne = Caml_bytes.get64;

var set_int8 = Caml_bytes.set;

var set_uint16_be = set_int16_be;

var set_uint16_le = set_int16_le;

var set_int16_ne = Caml_bytes.set16;

var set_int32_ne = Caml_bytes.set32;

var set_int64_ne = Caml_bytes.set64;

export {
  make ,
  init ,
  empty ,
  copy ,
  of_string ,
  to_string ,
  sub ,
  sub_string ,
  extend ,
  fill ,
  blit ,
  blit_string ,
  concat ,
  cat ,
  iter ,
  iteri ,
  map ,
  mapi ,
  fold_left ,
  fold_right ,
  for_all ,
  exists ,
  trim ,
  escaped ,
  index ,
  index_opt ,
  rindex ,
  rindex_opt ,
  index_from ,
  index_from_opt ,
  rindex_from ,
  rindex_from_opt ,
  contains ,
  contains_from ,
  rcontains_from ,
  uppercase_ascii ,
  lowercase_ascii ,
  capitalize_ascii ,
  uncapitalize_ascii ,
  compare ,
  equal ,
  starts_with ,
  ends_with ,
  unsafe_to_string ,
  unsafe_of_string ,
  split_on_char ,
  to_seq ,
  to_seqi ,
  of_seq ,
  get_utf_8_uchar ,
  set_utf_8_uchar ,
  is_valid_utf_8 ,
  get_utf_16be_uchar ,
  set_utf_16be_uchar ,
  is_valid_utf_16be ,
  get_utf_16le_uchar ,
  set_utf_16le_uchar ,
  is_valid_utf_16le ,
  get_uint8 ,
  get_int8 ,
  get_uint16_ne ,
  get_uint16_be ,
  get_uint16_le ,
  get_int16_ne ,
  get_int16_be ,
  get_int16_le ,
  get_int32_ne ,
  get_int32_be ,
  get_int32_le ,
  get_int64_ne ,
  get_int64_be ,
  get_int64_le ,
  set_uint8 ,
  set_int8 ,
  set_uint16_ne ,
  set_uint16_be ,
  set_uint16_le ,
  set_int16_ne ,
  set_int16_be ,
  set_int16_le ,
  set_int32_ne ,
  set_int32_be ,
  set_int32_le ,
  set_int64_ne ,
  set_int64_be ,
  set_int64_le ,
  unsafe_escape ,
}
/* No side effect */
