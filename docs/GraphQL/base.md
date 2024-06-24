# GraphQL基本の挙動

基本的にどのようなリクエストを送ろうと、GraphQLのサーバが生きている限りstatusは200になる。  
リクエストが不正だった場合は `response.errors` に配列でエラー情報が格納される。

サーバ側で予期せぬエラーのみステータスコードが変わる模様。  
そもそもサーバにリクエストが到達できなかった場合も含め、予期せぬエラーは `fetch().catch(err)` で拾える。

```json
{
    "data": null,
    "errors": [
        {
            "message": "authentication error",
            "locations": [],
            "path": null,
            "extensions": {
                "errorType": "UNAUTHENTICATED"
            },
            "errorType": null
        }
    ]
}
```
