FROM rust:1.75-slim as builder

WORKDIR /usr/src/app
COPY . .

RUN cargo build --release

FROM debian:bookworm-slim

COPY --from=builder /usr/src/app/target/release/rust-compressor /usr/local/bin/rust-compressor

ENTRYPOINT ["rust-compressor"]
