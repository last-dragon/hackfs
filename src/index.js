// import confetti from 'canvas-confetti';
import browserImageSize from 'browser-image-size'

const main = async () => {
  const getIdentity = async () => {
    try {
      var storedIdent = localStorage.getItem("identity");
      if (storedIdent === null) {
        throw new Error("No identity");
      }
      const restored = threads.Libp2pCryptoIdentity.fromString(storedIdent);
      return restored;
    }
    catch (e) {
      /**
       * If any error, create a new identity.
       */
      try {
        const identity = await threads.Libp2pCryptoIdentity.fromRandom();
        const identityString = identity.toString();
        localStorage.setItem("identity", identityString);
        return identity;
      } catch (err) {
        return err.message;
      }
    }
  };

  /**
   * getBucketKey will create a new Buckets client with the UserAuth
   * and then open our custom bucket named, 'io.textile.dropzone'
   */
  const getBucketKey = async () => {
    if (!oya.identity) {
      throw new Error('Identity not set')
    }

    // TODO - pull this from somewhere else
    const buckets = await textile.Buckets.withKeyInfo({key:'brqbnrvpihcdrdjh2japbkgd6mm'})
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(oya.identity)

    const root = await buckets.open('io.textile.dropzone')
    if (!root) {
      throw new Error('Failed to open bucket')
    }
    return {buckets: buckets, bucketKey: root.key};
  }

  var oya = {};
  oya.identity = await getIdentity();
  console.log(oya.identity);
  console.log(getBucketKey());
};
main();

