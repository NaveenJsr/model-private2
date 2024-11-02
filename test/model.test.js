// describe("user1 request", function () {
//     // this.timeout(120000);  // Set timeout to 2 minutes

//     let userContract;
//     let signer;

//     before(async function () {
//         signer = new ethers.Wallet("4b95ed8de50a3fa2a213a74e48bcab6eec8e669492cf655dd357876daff4f60d", ethers.provider);

//         const USER = await ethers.getContractFactory("USER");
//         userContract = await USER.attach("0x09D4a03C796507708CE72CE0eDd76961313033eF");
//     });

//     it("upload and download file multiple times", async function () {
//             try {
//                 // this.timeout(120000 + i * 60000);

//                 const tx1 = await userContract.connect(signer).uploadFile(
//                     "0x8FAcea5b3E2fbb4187cafFdAAFFdCa9482621486",  // csp address
//                     "abc",  // File name or another string parameter
//                     "abccomhash",  // Varying URL or file reference for each iteration
//                     "abchash"  // Varying file hash for each iteration
//                 );
                
//                 await tx1.wait();
                
//                 // const tx2 = await userContract.connect(signer).generageKey("c6a7aa91874e9d55e81bd660c01a7a71063cd8dea897f5711d954bd816fc9b0f");
//                 // await tx2.wait();
             
//                 console.log(`cycle  transactions successful `);

//             } catch (error) {
//                 console.error(`Transaction  failed: `, error);
//             }
        
//         console.log("All transactions completed.");
//     });

// });

// describe("user2 request", function () {
//     // this.timeout(120000);  // Set timeout to 2 minutes

//     let userContract;
//     let signer;

//     before(async function () {
//         signer = new ethers.Wallet("cdd0e6e0b6eab9dc2b62e71f35b3b7e4334bbdfb8755cc2f40ccc82a4736f3fd", ethers.provider);

//         const USER = await ethers.getContractFactory("USER");
//         userContract = await USER.attach("0x1Cea39bAb773D180A82f98Aa8480f8658293090a");
//     });

//     it("upload and download file multiple times", async function () {
//         for (let i = 0; i < 10; i++) {
//             try {
//                 this.timeout(120000 + i * 60000);

//                 const tx1 = await userContract.connect(signer).uploadFile(
//                     "0x8FAcea5b3E2fbb4187cafFdAAFFdCa9482621486",  // csp address
//                     "abc",  // File name or another string parameter
//                     `abccomhash${i}`,  // Varying URL or file reference for each iteration
//                     `abchash${i}`  // Varying file hash for each iteration
//                 );
                
//                 await tx1.wait();
                
//                 const tx2 = await userContract.connect(signer).generageKey("c6a7aa91874e9d55e81bd660c01a7a71063cd8dea897f5711d954bd816fc9b0f");
//                 await tx2.wait();
             
//                 // console.log(`cycle ${i + 1} transactions successful `);

//             } catch (error) {
//                 console.error(`Transaction ${i + 1} failed: `, error);
//             }
//         }

//         console.log("All transactions completed.");
//     });

// });
















// describe("user1 request", function () {
//     let userContract;
//     let signer;

//     before(async function () {
//         signer = new ethers.Wallet("4b95ed8de50a3fa2a213a74e48bcab6eec8e669492cf655dd357876daff4f60d", ethers.provider);

//         const USER = await ethers.getContractFactory("USER");
//         userContract = await USER.attach("0x09D4a03C796507708CE72CE0eDd76961313033eF");
//     });

//     it("upload and download file 1 times concurrently", async function () {
//         const promises = [];

//         for (let i = 0; i < 1; i++) {
//             const uploadPromise = (async (iteration) => {
//                 try {
//                     const tx1 = await userContract.connect(signer).uploadFile(
//                         "0x8FAcea5b3E2fbb4187cafFdAAFFdCa9482621486",  // CSP address
//                         "abc",  // File name or another string parameter
//                         `abccomhash${iteration}`,  // Varying URL or file reference for each iteration
//                         `abchash${iteration}`  // Varying file hash for each iteration
//                     );

//                     const receipt1 = await tx1.wait();

//                     const tx2 = await userContract.connect(signer).generageKey("5118f797ff2a750c4fbf659e6fab6170b5435d97907b6f2e8324dc383f6c8173");
//                     const recipt2 = await tx2.wait();

//                     console.log(`Transaction ${iteration + 1} completed successfully. | gasUsed ${receipt1.gasUsed + recipt2.gasUsed}`);
//                 } catch (error) {
//                     console.error(`Transaction ${iteration + 1} failed:`, error);
//                 }
//             })(i);

//             promises.push(uploadPromise);
//         }

//         // Wait for all 100 transactions to complete
//         await Promise.all(promises);
//         console.log("All transactions completed.");
//     });
// });




describe("user1 request", function () {
    let userContract;
    let signer;

    before(async function () {
        signer = new ethers.Wallet("4b95ed8de50a3fa2a213a74e48bcab6eec8e669492cf655dd357876daff4f60d", ethers.provider);

        const USER = await ethers.getContractFactory("USER");
        userContract = await USER.attach("0x09D4a03C796507708CE72CE0eDd76961313033eF");
    });

    it("upload and download file 1 time concurrently", async function () {
        const promises = [];
        const gasPriceIncrement = ethers.utils.parseUnits('1', 'gwei'); // Increase gas price by 1 gwei with each transaction

        // Get the initial nonce for the signer
        let nonce = await signer.getTransactionCount();

        for (let i = 0; i < 2; i++) {
            const uploadPromise = (async (iteration) => {
                try {
                    const gasPrice = ethers.utils.parseUnits('20', 'gwei').add(gasPriceIncrement.mul(iteration)); // Vary gas price

                    const tx1 = await userContract.connect(signer).uploadFile(
                        "0x8FAcea5b3E2fbb4187cafFdAAFFdCa9482621486",  // CSP address
                        "abc",  // File name or another string parameter
                        `abccomhash${iteration}`,  // Varying URL or file reference for each iteration
                        `abchash${iteration}`,  // Varying file hash for each iteration
                        { nonce: nonce++, gasPrice: gasPrice }  // Increment nonce and set gas price
                    );

                    const receipt1 = await tx1.wait();

                    const tx2 = await userContract.connect(signer).generageKey("5118f797ff2a750c4fbf659e6fab6170b5435d97907b6f2e8324dc383f6c8173", {
                        nonce: nonce++, gasPrice: gasPrice
                    });
                    const recipt2 = await tx2.wait();

                    console.log(`Transaction ${iteration + 1} completed successfully. | Upload file txn gasUsed ${receipt1.gasUsed}, Download file txn gasUsed ${recipt2.gasUsed}`);
                } catch (error) {
                    console.error(`Transaction ${iteration + 1} failed:`, error);
                }
            })(i);

            promises.push(uploadPromise);
        }

        // Wait for all transactions to complete
        await Promise.all(promises);
        console.log("All transactions completed.");
    });
});
