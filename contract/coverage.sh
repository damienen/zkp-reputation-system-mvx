#!/bin/bash

cargo llvm-cov --ignore-filename-regex '(events.rs|storage.rs)' --open
