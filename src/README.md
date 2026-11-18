# スライドの内容と生成スクリプト

`slides.json` が本文・依頼例・講師ノート・出典データ。`build-presentation.mjs` は、編集可能な文字とJPEG素材からPowerPointを生成するスクリプトです。

作成には `@oai/artifact-tool` を利用しました。元の環境ではCodex同梱のランタイムを使用しています。このパッケージが解決可能なNode.js環境で、リポジトリ直下から次のように実行します。

```bash
node src/build-presentation.mjs work/export
```

日本語の表示にはHiragino SansとHiragino Maru Gothic ProNを指定しています。他環境では利用可能な日本語フォントに変更し、書き出し後に表示を確認してください。配布用の完成版は `slides/` に保存済みです。PDFは確認した各ページ画像から作成しています。
